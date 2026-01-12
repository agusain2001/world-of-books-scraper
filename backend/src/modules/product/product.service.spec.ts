import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
    let service: ProductService;
    let productRepository: Repository<Product>;
    let detailRepository: Repository<ProductDetail>;

    const mockProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sourceId: 'prod-12345',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 5.99,
        originalPrice: 12.99,
        currency: 'GBP',
        imageUrl: 'https://example.com/image.jpg',
        sourceUrl: 'https://www.worldofbooks.com/en-gb/product/12345',
        condition: 'Good',
        format: 'Paperback',
        inStock: true,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: null as unknown as string,
        category: null as unknown as any,
        detail: null as unknown as any,
        reviews: [],
    } as Product;

    const mockProductRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
        })),
    };

    const mockDetailRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: getRepositoryToken(ProductDetail),
                    useValue: mockDetailRepository,
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
        detailRepository = module.get<Repository<ProductDetail>>(getRepositoryToken(ProductDetail));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated products', async () => {
            const result = await service.findAll({ page: 1, limit: 20 });

            expect(result).toEqual({
                data: [mockProduct],
                total: 1,
                page: 1,
                limit: 20,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            });
        });

        it('should apply search filter', async () => {
            const queryBuilder = mockProductRepository.createQueryBuilder();

            await service.findAll({ search: 'Gatsby' });

            expect(queryBuilder.andWhere).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a product by id', async () => {
            mockProductRepository.findOne.mockResolvedValue(mockProduct);

            const result = await service.findById(mockProduct.id);

            expect(result).toEqual(mockProduct);
            expect(mockProductRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockProduct.id },
                relations: ['category', 'detail', 'reviews'],
            });
        });

        it('should throw NotFoundException if product not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.findById('nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('findBySourceId', () => {
        it('should return a product by source id', async () => {
            mockProductRepository.findOne.mockResolvedValue(mockProduct);

            const result = await service.findBySourceId('prod-12345');

            expect(result).toEqual(mockProduct);
        });

        it('should return null if not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            const result = await service.findBySourceId('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new product', async () => {
            const createDto = {
                sourceId: 'prod-12345',
                title: 'The Great Gatsby',
                sourceUrl: 'https://www.worldofbooks.com/en-gb/product/12345',
            };
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockResolvedValue(mockProduct);

            const result = await service.create(createDto);

            expect(result).toEqual(mockProduct);
            expect(mockProductRepository.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('upsertBySourceId', () => {
        it('should update existing product', async () => {
            const dto = {
                sourceId: 'prod-12345',
                title: 'Updated Title',
                sourceUrl: 'https://www.worldofbooks.com/en-gb/product/12345',
            };
            mockProductRepository.findOne.mockResolvedValue(mockProduct);
            mockProductRepository.save.mockResolvedValue({ ...mockProduct, ...dto });

            const result = await service.upsertBySourceId(dto);

            expect(result.title).toEqual('Updated Title');
        });

        it('should create new product if not exists', async () => {
            const dto = {
                sourceId: 'prod-new',
                title: 'New Book',
                sourceUrl: 'https://www.worldofbooks.com/en-gb/product/new',
            };
            mockProductRepository.findOne.mockResolvedValue(null);
            mockProductRepository.create.mockReturnValue({ ...mockProduct, ...dto });
            mockProductRepository.save.mockResolvedValue({ ...mockProduct, ...dto });

            const result = await service.upsertBySourceId(dto);

            expect(result.sourceId).toEqual('prod-new');
        });
    });

    describe('getRelatedProducts', () => {
        it('should return products from same category', async () => {
            const productWithCategory = { ...mockProduct, categoryId: 'cat-123' };
            mockProductRepository.findOne.mockResolvedValue(productWithCategory);
            mockProductRepository.find.mockResolvedValue([mockProduct]);

            const result = await service.getRelatedProducts(mockProduct.id, 6);

            expect(result).toBeDefined();
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                where: { categoryId: 'cat-123' },
                take: 7,
                order: { createdAt: 'DESC' },
            });
        });

        it('should return empty array if no category', async () => {
            mockProductRepository.findOne.mockResolvedValue({ ...mockProduct, categoryId: null });

            const result = await service.getRelatedProducts(mockProduct.id);

            expect(result).toEqual([]);
        });
    });
});
