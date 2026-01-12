import { DataSource } from 'typeorm';
import {
    Navigation,
    Category,
    Product,
    ProductDetail,
    Review,
    ScrapeJob,
    ViewHistory,
} from '../src/entities';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'worldofbooks',
    entities: [Navigation, Category, Product, ProductDetail, Review, ScrapeJob, ViewHistory],
    synchronize: true,
});

async function seed() {
    console.log('🌱 Starting database seed...');

    await dataSource.initialize();
    console.log('✅ Database connected');

    const navigationRepo = dataSource.getRepository(Navigation);
    const categoryRepo = dataSource.getRepository(Category);
    const productRepo = dataSource.getRepository(Product);
    const productDetailRepo = dataSource.getRepository(ProductDetail);
    const reviewRepo = dataSource.getRepository(Review);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await reviewRepo.delete({});
    await productDetailRepo.delete({});
    await productRepo.delete({});
    await categoryRepo.delete({});
    await navigationRepo.delete({});

    // Seed Navigations
    console.log('📚 Seeding navigations...');
    const navigations = await navigationRepo.save([
        { title: 'Books', slug: 'books', url: 'https://www.worldofbooks.com/en-gb/books', order: 0 },
        { title: 'Categories', slug: 'categories', url: 'https://www.worldofbooks.com/en-gb/category', order: 1 },
        { title: "Children's Books", slug: 'childrens-books', url: 'https://www.worldofbooks.com/en-gb/category/childrens-books', order: 2 },
        { title: 'Fiction', slug: 'fiction', url: 'https://www.worldofbooks.com/en-gb/category/fiction', order: 3 },
        { title: 'Non-Fiction', slug: 'non-fiction', url: 'https://www.worldofbooks.com/en-gb/category/non-fiction', order: 4 },
    ]);
    console.log(`  ✅ Created ${navigations.length} navigations`);

    // Seed Categories
    console.log('📂 Seeding categories...');
    const categories = await categoryRepo.save([
        {
            title: 'Fiction',
            slug: 'fiction',
            url: 'https://www.worldofbooks.com/en-gb/category/fiction',
            productCount: 15000,
            navigationId: navigations[0].id,
        },
        {
            title: 'Non-Fiction',
            slug: 'non-fiction',
            url: 'https://www.worldofbooks.com/en-gb/category/non-fiction',
            productCount: 12000,
            navigationId: navigations[0].id,
        },
        {
            title: "Children's Books",
            slug: 'childrens-books',
            url: 'https://www.worldofbooks.com/en-gb/category/childrens-books',
            productCount: 8000,
            navigationId: navigations[0].id,
        },
        {
            title: 'Science Fiction',
            slug: 'science-fiction',
            url: 'https://www.worldofbooks.com/en-gb/category/science-fiction',
            productCount: 3500,
            navigationId: navigations[0].id,
        },
        {
            title: 'Biography',
            slug: 'biography',
            url: 'https://www.worldofbooks.com/en-gb/category/biography',
            productCount: 4200,
            navigationId: navigations[0].id,
        },
        {
            title: 'History',
            slug: 'history',
            url: 'https://www.worldofbooks.com/en-gb/category/history',
            productCount: 5100,
            navigationId: navigations[0].id,
        },
    ]);

    // Add subcategories
    await categoryRepo.save([
        { title: 'Classic Fiction', slug: 'classic-fiction', parentId: categories[0].id, productCount: 2500 },
        { title: 'Contemporary Fiction', slug: 'contemporary-fiction', parentId: categories[0].id, productCount: 4000 },
        { title: 'Science & Nature', slug: 'science-nature', parentId: categories[1].id, productCount: 3000 },
        { title: 'Self Help', slug: 'self-help', parentId: categories[1].id, productCount: 2800 },
    ]);
    console.log(`  ✅ Created ${categories.length + 4} categories`);

    // Seed Products
    console.log('📖 Seeding products...');
    const sampleProducts = [
        {
            sourceId: 'prod-001',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            price: 5.99,
            originalPrice: 12.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-001',
            condition: 'Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[0].id,
        },
        {
            sourceId: 'prod-002',
            title: '1984',
            author: 'George Orwell',
            price: 4.99,
            originalPrice: 10.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-002',
            condition: 'Very Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[0].id,
        },
        {
            sourceId: 'prod-003',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            price: 6.49,
            originalPrice: 14.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-003',
            condition: 'Like New',
            format: 'Hardback',
            inStock: true,
            categoryId: categories[0].id,
        },
        {
            sourceId: 'prod-004',
            title: 'A Brief History of Time',
            author: 'Stephen Hawking',
            price: 7.99,
            originalPrice: 15.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-004',
            condition: 'Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[1].id,
        },
        {
            sourceId: 'prod-005',
            title: 'The Diary of a Young Girl',
            author: 'Anne Frank',
            price: 4.49,
            originalPrice: 9.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-005',
            condition: 'Very Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[4].id,
        },
        {
            sourceId: 'prod-006',
            title: 'Dune',
            author: 'Frank Herbert',
            price: 5.49,
            originalPrice: 11.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-006',
            condition: 'Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[3].id,
        },
        {
            sourceId: 'prod-007',
            title: 'Harry Potter and the Philosopher\'s Stone',
            author: 'J.K. Rowling',
            price: 6.99,
            originalPrice: 13.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-007',
            condition: 'Very Good',
            format: 'Paperback',
            inStock: true,
            categoryId: categories[2].id,
        },
        {
            sourceId: 'prod-008',
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            price: 8.99,
            originalPrice: 16.99,
            currency: 'GBP',
            imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
            sourceUrl: 'https://www.worldofbooks.com/en-gb/product/prod-008',
            condition: 'Like New',
            format: 'Hardback',
            inStock: true,
            categoryId: categories[5].id,
        },
    ];

    const products = await productRepo.save(sampleProducts);
    console.log(`  ✅ Created ${products.length} products`);

    // Seed Product Details
    console.log('📝 Seeding product details...');
    const productDetails = await productDetailRepo.save([
        {
            productId: products[0].id,
            description: 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.',
            publisher: 'Scribner',
            isbn: '0743273567',
            isbn13: '978-0743273565',
            pages: 180,
            language: 'English',
            ratingsAvg: 4.5,
            reviewsCount: 3,
        },
        {
            productId: products[1].id,
            description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
            publisher: 'Penguin Books',
            isbn: '0451524934',
            isbn13: '978-0451524935',
            pages: 328,
            language: 'English',
            ratingsAvg: 4.7,
            reviewsCount: 5,
        },
        {
            productId: products[2].id,
            description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
            publisher: 'Harper Perennial',
            isbn: '0060935464',
            isbn13: '978-0060935467',
            pages: 336,
            language: 'English',
            ratingsAvg: 4.8,
            reviewsCount: 4,
        },
    ]);
    console.log(`  ✅ Created ${productDetails.length} product details`);

    // Seed Reviews
    console.log('⭐ Seeding reviews...');
    const reviews = await reviewRepo.save([
        {
            productId: products[0].id,
            author: 'John D.',
            rating: 5,
            title: 'A true classic',
            text: 'This book is a masterpiece. Fitzgerald\'s prose is beautiful and the story is timeless.',
            verified: true,
        },
        {
            productId: products[0].id,
            author: 'Sarah M.',
            rating: 4,
            title: 'Great book, good condition',
            text: 'The book arrived in good condition and the story is as amazing as I remembered from school.',
            verified: true,
        },
        {
            productId: products[1].id,
            author: 'Mike R.',
            rating: 5,
            title: 'Terrifyingly prescient',
            text: 'Orwell\'s vision of the future seems more relevant today than ever. A must-read.',
            verified: true,
        },
        {
            productId: products[2].id,
            author: 'Emily K.',
            rating: 5,
            title: 'Powerful and moving',
            text: 'This book changed my perspective on many things. Harper Lee\'s writing is exceptional.',
            verified: true,
        },
    ]);
    console.log(`  ✅ Created ${reviews.length} reviews`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`
Summary:
  - Navigations: ${navigations.length}
  - Categories: ${categories.length + 4}
  - Products: ${products.length}
  - Product Details: ${productDetails.length}
  - Reviews: ${reviews.length}
  `);

    await dataSource.destroy();
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
