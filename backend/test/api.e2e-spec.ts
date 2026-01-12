import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Navigation API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/navigations (GET)', () => {
        it('should return an array of navigations', () => {
            return request(app.getHttpServer())
                .get('/api/navigations')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/api/navigations (POST)', () => {
        it('should create a new navigation', () => {
            return request(app.getHttpServer())
                .post('/api/navigations')
                .send({
                    title: 'Test Navigation',
                    slug: 'test-navigation-' + Date.now(),
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.title).toBe('Test Navigation');
                });
        });

        it('should fail with invalid data', () => {
            return request(app.getHttpServer())
                .post('/api/navigations')
                .send({
                    title: '', // Invalid: empty title
                })
                .expect(400);
        });
    });
});

describe('Product API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/products (GET)', () => {
        it('should return paginated products', () => {
            return request(app.getHttpServer())
                .get('/api/products')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('data');
                    expect(res.body).toHaveProperty('total');
                    expect(res.body).toHaveProperty('page');
                    expect(res.body).toHaveProperty('limit');
                    expect(res.body).toHaveProperty('totalPages');
                });
        });

        it('should support pagination', () => {
            return request(app.getHttpServer())
                .get('/api/products?page=1&limit=10')
                .expect(200)
                .expect((res) => {
                    expect(res.body.page).toBe(1);
                    expect(res.body.limit).toBe(10);
                });
        });

        it('should support search filter', () => {
            return request(app.getHttpServer())
                .get('/api/products?search=book')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.data)).toBe(true);
                });
        });
    });

    describe('/api/products/:id (GET)', () => {
        it('should return 404 for non-existent product', () => {
            return request(app.getHttpServer())
                .get('/api/products/00000000-0000-0000-0000-000000000000')
                .expect(404);
        });
    });
});

describe('Category API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/categories (GET)', () => {
        it('should return an array of categories', () => {
            return request(app.getHttpServer())
                .get('/api/categories')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/api/categories/tree (GET)', () => {
        it('should return category tree', () => {
            return request(app.getHttpServer())
                .get('/api/categories/tree')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });
});
