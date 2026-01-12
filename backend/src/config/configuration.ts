export default () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        name: process.env.DATABASE_NAME || 'worldofbooks',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },

    scraping: {
        baseUrl: process.env.SCRAPE_BASE_URL || 'https://www.worldofbooks.com',
        delayMs: parseInt(process.env.SCRAPE_DELAY_MS || '2000', 10),
        maxRetries: parseInt(process.env.SCRAPE_MAX_RETRIES || '3', 10),
        cacheTtlHours: parseInt(process.env.CACHE_TTL_HOURS || '24', 10),
    },

    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
});
