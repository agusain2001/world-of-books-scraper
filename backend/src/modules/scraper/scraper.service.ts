import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler, Dataset, Configuration } from 'crawlee';
import { ScrapeJob, ScrapeJobStatus, ScrapeTargetType } from '../../entities/scrape-job.entity';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { ReviewService } from '../review/review.service';

export interface ScrapedNavigation {
    title: string;
    slug: string;
    url: string;
    order: number;
}

export interface ScrapedCategory {
    title: string;
    slug: string;
    url: string;
    imageUrl?: string;
    productCount?: number;
    parentSlug?: string;
}

export interface ScrapedProduct {
    sourceId: string;
    title: string;
    author?: string;
    price?: number;
    originalPrice?: number;
    currency: string;
    imageUrl?: string;
    sourceUrl: string;
    condition?: string;
    format?: string;
    inStock: boolean;
}

export interface ScrapedProductDetail {
    description?: string;
    publisher?: string;
    publicationDate?: Date;
    isbn?: string;
    isbn13?: string;
    pages?: number;
    language?: string;
    dimensions?: string;
    weight?: string;
    specs?: Record<string, any>;
    ratingsAvg?: number;
    reviewsCount?: number;
    reviews?: ScrapedReview[];
    relatedProducts?: { sourceId: string; title: string; url: string }[];
    recommendedProducts?: { sourceId: string; title: string; url: string }[];
}

export interface ScrapedReview {
    author?: string;
    rating?: number;
    title?: string;
    text?: string;
    reviewDate?: Date;
    verified?: boolean;
}

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ScraperService.name);
    private crawler: PlaywrightCrawler | null = null;
    private isRunning = false;
    private readonly baseUrl: string;
    private readonly delayMs: number;
    private readonly maxRetries: number;
    private readonly cacheTtlHours: number;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(ScrapeJob)
        private readonly scrapeJobRepository: Repository<ScrapeJob>,
        private readonly navigationService: NavigationService,
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly reviewService: ReviewService,
    ) {
        this.baseUrl = this.configService.get<string>('scraping.baseUrl') || 'https://www.worldofbooks.com';
        this.delayMs = this.configService.get<number>('scraping.delayMs') || 2000;
        this.maxRetries = this.configService.get<number>('scraping.maxRetries') || 3;
        this.cacheTtlHours = this.configService.get<number>('scraping.cacheTtlHours') || 24;
    }

    async onModuleInit() {
        this.logger.log('ScraperService initialized');
    }

    async onModuleDestroy() {
        if (this.crawler) {
            await this.crawler.teardown();
        }
    }

    private slugify(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private extractSourceId(url: string): string {
        // Extract product ID from URL like /en-gb/product/12345-product-title
        const match = url.match(/\/product\/([^\/\?]+)/);
        if (match) {
            return match[1];
        }
        // Fallback: use the whole URL path as ID
        return this.slugify(url.replace(this.baseUrl, ''));
    }

    async createScrapeJob(targetUrl: string, targetType: ScrapeTargetType): Promise<ScrapeJob> {
        const job = this.scrapeJobRepository.create({
            targetUrl,
            targetType,
            status: ScrapeJobStatus.PENDING,
        });
        return this.scrapeJobRepository.save(job);
    }

    async updateJobStatus(
        jobId: string,
        status: ScrapeJobStatus,
        updates: Partial<ScrapeJob> = {},
    ): Promise<void> {
        await this.scrapeJobRepository.update(jobId, {
            status,
            ...updates,
            ...(status === ScrapeJobStatus.RUNNING ? { startedAt: new Date() } : {}),
            ...(status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED
                ? { finishedAt: new Date() }
                : {}),
        });
    }

    async getJobStatus(jobId: string): Promise<ScrapeJob | null> {
        return this.scrapeJobRepository.findOne({ where: { id: jobId } });
    }

    async getAllJobs(): Promise<ScrapeJob[]> {
        return this.scrapeJobRepository.find({
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }

    async scrapeNavigations(forceRefresh = false): Promise<ScrapedNavigation[]> {
        this.logger.log('Starting navigation scrape...');

        const job = await this.createScrapeJob(this.baseUrl, ScrapeTargetType.NAVIGATION);
        await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

        const navigations: ScrapedNavigation[] = [];

        try {
            const crawler = new PlaywrightCrawler({
                maxRequestsPerMinute: 30,
                requestHandlerTimeoutSecs: 60,
                navigationTimeoutSecs: 30,

                async requestHandler({ page, request, log }) {
                    log.info(`Processing ${request.url}`);

                    await page.waitForLoadState('domcontentloaded');
                    await page.waitForTimeout(1000);

                    // Get navigation items from the main menu
                    const navItems = await page.evaluate(() => {
                        const items: { title: string; url: string }[] = [];

                        // Try different selectors for navigation
                        const selectors = [
                            'nav a',
                            '.main-nav a',
                            '.navigation a',
                            'header nav a',
                            '[data-testid="nav-link"]',
                            '.menu a',
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            elements.forEach((el) => {
                                const link = el as HTMLAnchorElement;
                                const title = link.textContent?.trim();
                                const url = link.href;

                                if (title && url && !url.includes('#') && !items.some(i => i.url === url)) {
                                    items.push({ title, url });
                                }
                            });

                            if (items.length > 0) break;
                        }

                        return items;
                    });

                    navItems.forEach((item, index) => {
                        navigations.push({
                            title: item.title,
                            slug: item.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
                            url: item.url,
                            order: index,
                        });
                    });
                },
            });

            await crawler.run([this.baseUrl]);
            await crawler.teardown();

            // Save navigations to database
            for (const nav of navigations) {
                await this.navigationService.upsertBySlug(nav);
            }

            await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, {
                itemsScraped: navigations.length,
            });

            this.logger.log(`Scraped ${navigations.length} navigation items`);
            return navigations;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Navigation scrape failed: ${errorMessage}`);
            await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, {
                errorLog: errorMessage,
            });
            throw error;
        }
    }

    async scrapeCategories(navigationSlug?: string, forceRefresh = false): Promise<ScrapedCategory[]> {
        this.logger.log(`Starting category scrape for navigation: ${navigationSlug || 'all'}`);

        // World of Books uses /en-gb/collections for category listings
        // Use the main page to discover all collection links
        let startUrl = `${this.baseUrl}/en-gb`;
        if (navigationSlug) {
            // If a specific navigation slug is provided, go to that page
            startUrl = `${this.baseUrl}/en-gb/pages/${navigationSlug}`;
        }

        const job = await this.createScrapeJob(startUrl, ScrapeTargetType.CATEGORY);
        await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

        const categories: ScrapedCategory[] = [];

        try {
            const crawler = new PlaywrightCrawler({
                maxRequestsPerMinute: 30,
                requestHandlerTimeoutSecs: 90,
                navigationTimeoutSecs: 60,

                async requestHandler({ page, request, log }) {
                    log.info(`Processing categories from ${request.url}`);

                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(2000);

                    // Get category items - look for collection links
                    const categoryItems = await page.evaluate(() => {
                        const items: { title: string; url: string; imageUrl?: string; productCount?: string }[] = [];
                        const seenUrls = new Set<string>();

                        // World of Books specific selectors for categories/collections
                        const selectors = [
                            // Main navigation and sidebar category links
                            'a[href*="/collections/"]',
                            '.collection-link',
                            '.category-link',
                            // Menu items
                            '.mega-menu a',
                            '.nav-link[href*="/collections/"]',
                            // Category cards on landing pages
                            '.category-card a',
                            '.collection-card a',
                            // Sidebar filters
                            '.sidebar a[href*="/collections/"]',
                            '.filter-list a',
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            elements.forEach((el) => {
                                const link = el as HTMLAnchorElement;
                                const url = link.href;

                                // Only include collection URLs
                                if (!url.includes('/collections/')) return;

                                // Skip duplicate URLs
                                if (seenUrls.has(url)) return;
                                seenUrls.add(url);

                                // Get title from link text or parent container
                                const title = link.textContent?.trim() ||
                                    link.getAttribute('title') ||
                                    link.querySelector('.title, h2, h3, span')?.textContent?.trim();

                                // Try to get image
                                const img = link.querySelector('img') || link.parentElement?.querySelector('img');
                                const imageUrl = img?.src;

                                if (title && title.length > 1 && title.length < 100) {
                                    items.push({ title, url, imageUrl });
                                }
                            });
                        }

                        return items;
                    });

                    categoryItems.forEach((item) => {
                        // Extract slug from URL, e.g., /en-gb/collections/fiction-books -> fiction-books
                        const urlMatch = item.url.match(/\/collections\/([^\/\?]+)/);
                        const slug = urlMatch ? urlMatch[1] : item.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

                        // Don't add if we already have this slug
                        if (categories.some(c => c.slug === slug)) return;

                        categories.push({
                            title: item.title,
                            slug,
                            url: item.url,
                            imageUrl: item.imageUrl,
                        });
                    });
                },
            });

            await crawler.run([startUrl]);
            await crawler.teardown();

            // Save categories to database
            for (const cat of categories) {
                await this.categoryService.upsertBySlug(cat);
            }

            await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, {
                itemsScraped: categories.length,
            });

            this.logger.log(`Scraped ${categories.length} categories`);
            return categories;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Category scrape failed: ${errorMessage}`);
            await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, {
                errorLog: errorMessage,
            });
            throw error;
        }
    }

    async scrapeProductList(
        categorySlug: string,
        page: number = 1,
        limit: number = 20,
        forceRefresh = false,
    ): Promise<ScrapedProduct[]> {
        this.logger.log(`Starting product list scrape for category: ${categorySlug}, page: ${page}`);

        // World of Books uses /en-gb/collections for category listings
        const startUrl = `${this.baseUrl}/en-gb/collections/${categorySlug}?page=${page}`;

        const job = await this.createScrapeJob(startUrl, ScrapeTargetType.PRODUCT_LIST);
        await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

        const products: ScrapedProduct[] = [];

        try {
            const self = this;

            const crawler = new PlaywrightCrawler({
                maxRequestsPerMinute: 30,
                requestHandlerTimeoutSecs: 90,
                navigationTimeoutSecs: 60,

                async requestHandler({ page, request, log }) {
                    log.info(`Processing products from ${request.url}`);

                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(2000);

                    // Get product items - World of Books uses Algolia Instant Search
                    const productItems = await page.evaluate(() => {
                        const items: {
                            title: string;
                            author?: string;
                            price?: string;
                            originalPrice?: string;
                            imageUrl?: string;
                            url: string;
                            condition?: string;
                            format?: string;
                        }[] = [];

                        // World of Books uses Algolia Instant Search for product listings
                        // The container is li.ais-InfiniteHits-item
                        const productContainers = document.querySelectorAll('li.ais-InfiniteHits-item');

                        productContainers.forEach((container) => {
                            // Get title and URL from the product link
                            const linkEl = container.querySelector('a.product-card.truncate-title') ||
                                container.querySelector('a.product-card') ||
                                container.querySelector('a[href*="/products/"]');

                            // Get author
                            const authorEl = container.querySelector('p.author.truncate-author') ||
                                container.querySelector('.author');

                            // Get price
                            const priceEl = container.querySelector('.price');

                            // Get image
                            const imgEl = container.querySelector('img');

                            const title = linkEl?.textContent?.trim();
                            const url = (linkEl as HTMLAnchorElement)?.href;

                            if (title && url && url.includes('/products/')) {
                                items.push({
                                    title,
                                    author: authorEl?.textContent?.trim(),
                                    price: priceEl?.textContent?.match(/[\d.,]+/)?.[0],
                                    imageUrl: imgEl?.src,
                                    url,
                                });
                            }
                        });

                        // Fallback: try other selectors if Algolia selectors didn't work
                        if (items.length === 0) {
                            const fallbackSelectors = [
                                '.product-card',
                                '.product-tile',
                                '.grid-item.product',
                            ];

                            for (const selector of fallbackSelectors) {
                                const elements = document.querySelectorAll(selector);
                                elements.forEach((el) => {
                                    const link = el.querySelector('a[href*="/products/"]') || el.querySelector('a');
                                    const titleEl = el.querySelector('.product-card__title, h2, h3, .title');
                                    const authorEl = el.querySelector('.author, .subtitle');
                                    const priceEl = el.querySelector('.price');
                                    const img = el.querySelector('img');

                                    const title = titleEl?.textContent?.trim() || link?.textContent?.trim();
                                    const url = (link as HTMLAnchorElement)?.href;

                                    if (title && url && url.includes('/products/')) {
                                        items.push({
                                            title,
                                            author: authorEl?.textContent?.trim(),
                                            price: priceEl?.textContent?.match(/[\d.,]+/)?.[0],
                                            imageUrl: img?.src,
                                            url,
                                        });
                                    }
                                });

                                if (items.length > 0) break;
                            }
                        }

                        return items;
                    });

                    productItems.forEach((item) => {
                        const sourceId = self.extractSourceId(item.url);
                        products.push({
                            sourceId,
                            title: item.title,
                            author: item.author,
                            price: item.price ? parseFloat(item.price.replace(',', '')) : undefined,
                            originalPrice: item.originalPrice ? parseFloat(item.originalPrice.replace(',', '')) : undefined,
                            currency: 'GBP',
                            imageUrl: item.imageUrl,
                            sourceUrl: item.url,
                            condition: item.condition,
                            format: item.format,
                            inStock: true,
                        });
                    });
                },
            });

            await crawler.run([startUrl]);
            await crawler.teardown();

            // Get category for linking
            let category;
            try {
                category = await this.categoryService.findBySlug(categorySlug);
            } catch (e) {
                // Category might not exist yet
            }

            // Save products to database
            for (const prod of products) {
                await this.productService.upsertBySourceId({
                    ...prod,
                    categoryId: category?.id,
                });
            }

            await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, {
                itemsScraped: products.length,
            });

            this.logger.log(`Scraped ${products.length} products`);
            return products;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Product list scrape failed: ${errorMessage}`);
            await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, {
                errorLog: errorMessage,
            });
            throw error;
        }
    }

    async scrapeProductDetail(
        productSourceId: string,
        forceRefresh = false,
    ): Promise<ScrapedProductDetail | null> {
        this.logger.log(`Starting product detail scrape for: ${productSourceId}`);

        const product = await this.productService.findBySourceId(productSourceId);
        if (!product) {
            this.logger.warn(`Product not found: ${productSourceId}`);
            return null;
        }

        // Check cache
        if (!forceRefresh && product.detail && product.lastScrapedAt) {
            const lastScraped = new Date(product.lastScrapedAt);
            const hoursSinceLastScrape = (Date.now() - lastScraped.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastScrape < this.cacheTtlHours) {
                this.logger.log(`Using cached product detail for: ${productSourceId}`);
                return product.detail as unknown as ScrapedProductDetail;
            }
        }

        const job = await this.createScrapeJob(product.sourceUrl, ScrapeTargetType.PRODUCT_DETAIL);
        await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

        // Use mutable holder to store result from async callback
        const resultHolder: { detail: ScrapedProductDetail | null } = { detail: null };

        try {
            const crawler = new PlaywrightCrawler({
                maxRequestsPerMinute: 30,
                requestHandlerTimeoutSecs: 60,
                navigationTimeoutSecs: 30,

                async requestHandler({ page, request, log }) {
                    log.info(`Processing product detail from ${request.url}`);

                    await page.waitForLoadState('domcontentloaded');
                    await page.waitForTimeout(2000);

                    // Get product details
                    const details = await page.evaluate(() => {
                        const data: {
                            description?: string;
                            publisher?: string;
                            isbn?: string;
                            isbn13?: string;
                            pages?: string;
                            language?: string;
                            dimensions?: string;
                            weight?: string;
                            publicationDate?: string;
                            ratingsAvg?: string;
                            reviewsCount?: string;
                            specs?: Record<string, string>;
                            reviews?: { author?: string; rating?: string; title?: string; text?: string; date?: string }[];
                            relatedProducts?: { title: string; url: string }[];
                        } = {};

                        // Description
                        const descEl = document.querySelector('.description, .product-description, [data-testid="description"]');
                        data.description = descEl?.textContent?.trim();

                        // Product specs table
                        const specsTable = document.querySelector('.specifications, .product-specs, table');
                        if (specsTable) {
                            data.specs = {};
                            specsTable.querySelectorAll('tr').forEach(row => {
                                const key = row.querySelector('th, td:first-child')?.textContent?.trim();
                                const value = row.querySelector('td:last-child')?.textContent?.trim();
                                if (key && value) {
                                    data.specs![key] = value;

                                    // Extract specific fields
                                    const keyLower = key.toLowerCase();
                                    if (keyLower.includes('publisher')) data.publisher = value;
                                    if (keyLower.includes('isbn') && !keyLower.includes('13')) data.isbn = value;
                                    if (keyLower.includes('isbn-13') || keyLower.includes('isbn13')) data.isbn13 = value;
                                    if (keyLower.includes('pages')) data.pages = value;
                                    if (keyLower.includes('language')) data.language = value;
                                    if (keyLower.includes('dimension')) data.dimensions = value;
                                    if (keyLower.includes('weight')) data.weight = value;
                                    if (keyLower.includes('publication') || keyLower.includes('date')) data.publicationDate = value;
                                }
                            });
                        }

                        // Rating
                        const ratingEl = document.querySelector('.rating, .product-rating, [data-testid="rating"]');
                        data.ratingsAvg = ratingEl?.textContent?.match(/[\d.]+/)?.[0];

                        // Reviews count
                        const reviewCountEl = document.querySelector('.review-count, .reviews-count');
                        data.reviewsCount = reviewCountEl?.textContent?.match(/\d+/)?.[0];

                        // Reviews
                        data.reviews = [];
                        document.querySelectorAll('.review, .product-review, [data-testid="review"]').forEach(reviewEl => {
                            const review = {
                                author: reviewEl.querySelector('.author, .reviewer-name')?.textContent?.trim(),
                                rating: reviewEl.querySelector('.rating, .stars')?.textContent?.match(/[\d.]+/)?.[0],
                                title: reviewEl.querySelector('.title, .review-title')?.textContent?.trim(),
                                text: reviewEl.querySelector('.text, .review-text, .content')?.textContent?.trim(),
                                date: reviewEl.querySelector('.date, .review-date')?.textContent?.trim(),
                            };
                            if (review.text || review.rating) {
                                data.reviews!.push(review);
                            }
                        });

                        // Related products
                        data.relatedProducts = [];
                        document.querySelectorAll('.related-products a, .you-may-like a, [data-testid="related-product"]').forEach(el => {
                            const link = el as HTMLAnchorElement;
                            const title = link.textContent?.trim();
                            if (title && link.href) {
                                data.relatedProducts!.push({ title, url: link.href });
                            }
                        });

                        return data;
                    });

                    resultHolder.detail = {
                        description: details.description,
                        publisher: details.publisher,
                        isbn: details.isbn,
                        isbn13: details.isbn13,
                        pages: details.pages ? parseInt(details.pages) : undefined,
                        language: details.language,
                        dimensions: details.dimensions,
                        weight: details.weight,
                        publicationDate: details.publicationDate ? new Date(details.publicationDate) : undefined,
                        ratingsAvg: details.ratingsAvg ? parseFloat(details.ratingsAvg) : undefined,
                        reviewsCount: details.reviewsCount ? parseInt(details.reviewsCount) : undefined,
                        specs: details.specs,
                        reviews: details.reviews?.map(r => ({
                            author: r.author,
                            rating: r.rating ? parseInt(r.rating) : undefined,
                            title: r.title,
                            text: r.text,
                            reviewDate: r.date ? new Date(r.date) : undefined,
                        })),
                        relatedProducts: details.relatedProducts?.map(p => ({
                            sourceId: p.url.match(/\/product\/([^\/\?]+)/)?.[1] || p.url,
                            title: p.title,
                            url: p.url,
                        })),
                    };
                },
            });

            await crawler.run([product.sourceUrl]);
            await crawler.teardown();

            const productDetail = resultHolder.detail;
            if (productDetail) {
                // Save product detail
                await this.productService.updateDetail(product.id, {
                    description: productDetail.description,
                    publisher: productDetail.publisher,
                    publicationDate: productDetail.publicationDate,
                    isbn: productDetail.isbn,
                    isbn13: productDetail.isbn13,
                    pages: productDetail.pages,
                    language: productDetail.language,
                    dimensions: productDetail.dimensions,
                    weight: productDetail.weight,
                    specs: productDetail.specs,
                    ratingsAvg: productDetail.ratingsAvg,
                    reviewsCount: productDetail.reviewsCount,
                    relatedProducts: productDetail.relatedProducts,
                    recommendedProducts: productDetail.recommendedProducts,
                });

                // Save reviews
                if (productDetail.reviews && productDetail.reviews.length > 0) {
                    await this.reviewService.upsertForProduct(
                        product.id,
                        productDetail.reviews.map(r => ({
                            author: r.author,
                            rating: r.rating,
                            title: r.title,
                            text: r.text,
                            reviewDate: r.reviewDate,
                            verified: r.verified,
                        })),
                    );
                }

                await this.productService.updateLastScraped(product.id);
            }

            await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, {
                itemsScraped: 1,
            });

            this.logger.log(`Scraped product detail for: ${productSourceId}`);
            return productDetail;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Product detail scrape failed: ${errorMessage}`);
            await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, {
                errorLog: errorMessage,
            });
            throw error;
        }
    }
}

