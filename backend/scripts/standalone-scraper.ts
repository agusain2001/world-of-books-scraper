/**
 * Standalone Scraper Script
 * This script scrapes World of Books without needing a database
 * Outputs data directly to JSON files in the /scraped-data directory
 */

import { PlaywrightCrawler } from 'crawlee';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://www.worldofbooks.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'scraped-data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface ScrapedNavigation {
    title: string;
    slug: string;
    url: string;
    order: number;
}

interface ScrapedCategory {
    title: string;
    slug: string;
    url: string;
    imageUrl?: string;
    productCount?: number;
}

interface ScrapedProduct {
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

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function saveToJson(filename: string, data: unknown): void {
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${filepath}`);
}

async function scrapeNavigations(): Promise<ScrapedNavigation[]> {
    console.log('\n🔍 Scraping navigations from World of Books...');
    const navigations: ScrapedNavigation[] = [];

    const crawler = new PlaywrightCrawler({
        maxRequestsPerMinute: 20,
        requestHandlerTimeoutSecs: 60,
        navigationTimeoutSecs: 30,
        headless: true,

        async requestHandler({ page, request, log }) {
            log.info(`Processing ${request.url}`);

            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);

            // Get navigation items from the main menu
            const navItems = await page.evaluate(() => {
                const items: { title: string; url: string }[] = [];

                // Try main navigation links
                const navLinks = document.querySelectorAll('nav a, header a, .nav a, .menu a');
                navLinks.forEach((el) => {
                    const link = el as HTMLAnchorElement;
                    const title = link.textContent?.trim();
                    const url = link.href;

                    if (title && url && url.includes('worldofbooks.com') && !url.includes('#') && title.length > 2) {
                        if (!items.some(i => i.url === url || i.title === title)) {
                            items.push({ title, url });
                        }
                    }
                });

                return items.slice(0, 10); // Limit to first 10 nav items
            });

            navItems.forEach((item, index) => {
                navigations.push({
                    title: item.title,
                    slug: slugify(item.title),
                    url: item.url,
                    order: index,
                });
            });
        },
    });

    await crawler.run([BASE_URL]);

    console.log(`📚 Found ${navigations.length} navigation items`);
    return navigations;
}

async function scrapeCategories(): Promise<ScrapedCategory[]> {
    console.log('\n🔍 Scraping categories from World of Books...');
    const categories: ScrapedCategory[] = [];

    const crawler = new PlaywrightCrawler({
        maxRequestsPerMinute: 20,
        requestHandlerTimeoutSecs: 60,
        headless: true,

        async requestHandler({ page, request, log }) {
            log.info(`Processing categories from ${request.url}`);

            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);

            // Get category items
            const categoryItems = await page.evaluate(() => {
                const items: { title: string; url: string; imageUrl?: string }[] = [];

                // Try to find category links
                const categorySelectors = [
                    'a[href*="/category/"]',
                    '.category a',
                    '[data-category] a',
                    '.categories a',
                ];

                for (const selector of categorySelectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el) => {
                        const link = el as HTMLAnchorElement;
                        const title = el.textContent?.trim() ||
                            el.querySelector('h2, h3, .title')?.textContent?.trim();
                        const url = link.href;
                        const img = el.querySelector('img');
                        const imageUrl = img?.src;

                        if (title && url && url.includes('/category/') && title.length > 2) {
                            if (!items.some(i => i.url === url)) {
                                items.push({ title, url, imageUrl });
                            }
                        }
                    });
                }

                return items.slice(0, 20); // Limit to 20 categories
            });

            categoryItems.forEach((item) => {
                categories.push({
                    title: item.title,
                    slug: slugify(item.title),
                    url: item.url,
                    imageUrl: item.imageUrl,
                });
            });
        },
    });

    await crawler.run([`${BASE_URL}/en-gb/category`]);

    console.log(`📂 Found ${categories.length} categories`);
    return categories;
}

async function scrapeProducts(categoryUrl?: string): Promise<ScrapedProduct[]> {
    const url = categoryUrl || `${BASE_URL}/en-gb/category/fiction`;
    console.log(`\n🔍 Scraping products from ${url}...`);
    const products: ScrapedProduct[] = [];

    const crawler = new PlaywrightCrawler({
        maxRequestsPerMinute: 20,
        requestHandlerTimeoutSecs: 90,
        headless: true,

        async requestHandler({ page, request, log }) {
            log.info(`Processing products from ${request.url}`);

            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);

            // Get product items
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

                // Try different product selectors
                const productSelectors = [
                    '[data-testid="product-tile"]',
                    '.product-tile',
                    '.product-card',
                    '.product-item',
                    'article[data-product]',
                    '.book-item',
                    '[class*="ProductCard"]',
                    '[class*="product-"]',
                ];

                for (const selector of productSelectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        console.log(`Found ${elements.length} products with selector: ${selector}`);
                        elements.forEach((el) => {
                            const link = el.querySelector('a[href*="/product/"]') || el.closest('a');
                            const titleEl = el.querySelector('h2, h3, .title, [class*="title"], [class*="name"]');
                            const authorEl = el.querySelector('.author, [class*="author"]');
                            const priceEl = el.querySelector('.price, [class*="price"]:not([class*="was"]):not([class*="original"])');
                            const originalPriceEl = el.querySelector('.was-price, .original-price, [class*="was"], [class*="original"]');
                            const img = el.querySelector('img');
                            const conditionEl = el.querySelector('.condition, [class*="condition"]');
                            const formatEl = el.querySelector('.format, [class*="format"]');

                            const title = titleEl?.textContent?.trim();
                            const url = (link as HTMLAnchorElement)?.href;

                            if (title && url) {
                                items.push({
                                    title,
                                    author: authorEl?.textContent?.trim(),
                                    price: priceEl?.textContent?.match(/[\d.,]+/)?.[0],
                                    originalPrice: originalPriceEl?.textContent?.match(/[\d.,]+/)?.[0],
                                    imageUrl: img?.src,
                                    url,
                                    condition: conditionEl?.textContent?.trim(),
                                    format: formatEl?.textContent?.trim(),
                                });
                            }
                        });
                        break;
                    }
                }

                return items.slice(0, 24); // Limit to 24 products
            });

            productItems.forEach((item) => {
                const sourceId = item.url.match(/\/product\/([^\/\?]+)/)?.[1] || slugify(item.title);
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

    await crawler.run([url]);

    console.log(`📖 Found ${products.length} products`);
    return products;
}

async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('   World of Books - Standalone Scraper');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n📁 Output directory: ${OUTPUT_DIR}\n`);

    try {
        // Scrape navigations
        const navigations = await scrapeNavigations();
        saveToJson('navigations.json', navigations);

        // Scrape categories
        const categories = await scrapeCategories();
        saveToJson('categories.json', categories);

        // Scrape products from fiction category
        const products = await scrapeProducts();
        saveToJson('products.json', products);

        // Create a summary
        const summary = {
            scrapedAt: new Date().toISOString(),
            stats: {
                navigations: navigations.length,
                categories: categories.length,
                products: products.length,
            },
        };
        saveToJson('summary.json', summary);

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('   ✅ Scraping Complete!');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`\n📊 Summary:`);
        console.log(`   - Navigations: ${navigations.length}`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`\n📁 Data saved to: ${OUTPUT_DIR}`);
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Scraping failed:', error);
        process.exit(1);
    }
}

main();
