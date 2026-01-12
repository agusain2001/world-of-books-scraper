import { Test, TestingModule } from '@nestjs/testing';
import { NavigationService } from './navigation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('NavigationService', () => {
    let service: NavigationService;
    let repository: Repository<Navigation>;

    const mockNavigation: Navigation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Books',
        slug: 'books',
        url: 'https://www.worldofbooks.com/en-gb/books',
        order: 0,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
    };

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NavigationService,
                {
                    provide: getRepositoryToken(Navigation),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<NavigationService>(NavigationService);
        repository = module.get<Repository<Navigation>>(getRepositoryToken(Navigation));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of navigations', async () => {
            mockRepository.find.mockResolvedValue([mockNavigation]);

            const result = await service.findAll();

            expect(result).toEqual([mockNavigation]);
            expect(mockRepository.find).toHaveBeenCalledWith({
                order: { order: 'ASC' },
                relations: ['categories'],
            });
        });
    });

    describe('findBySlug', () => {
        it('should return a navigation by slug', async () => {
            mockRepository.findOne.mockResolvedValue(mockNavigation);

            const result = await service.findBySlug('books');

            expect(result).toEqual(mockNavigation);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { slug: 'books' },
                relations: ['categories', 'categories.children'],
            });
        });

        it('should throw NotFoundException if navigation not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findBySlug('nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should create a new navigation', async () => {
            const createDto = { title: 'Books', slug: 'books' };
            mockRepository.create.mockReturnValue(mockNavigation);
            mockRepository.save.mockResolvedValue(mockNavigation);

            const result = await service.create(createDto);

            expect(result).toEqual(mockNavigation);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockNavigation);
        });
    });

    describe('upsertBySlug', () => {
        it('should update existing navigation', async () => {
            const dto = { title: 'Updated Books', slug: 'books' };
            mockRepository.findOne.mockResolvedValue(mockNavigation);
            mockRepository.save.mockResolvedValue({ ...mockNavigation, ...dto });

            const result = await service.upsertBySlug(dto);

            expect(result.title).toEqual('Updated Books');
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should create new navigation if not exists', async () => {
            const dto = { title: 'New Category', slug: 'new-category' };
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue({ ...mockNavigation, ...dto });
            mockRepository.save.mockResolvedValue({ ...mockNavigation, ...dto });

            const result = await service.upsertBySlug(dto);

            expect(result.slug).toEqual('new-category');
            expect(mockRepository.create).toHaveBeenCalled();
        });
    });

    describe('needsScraping', () => {
        it('should return true if never scraped', async () => {
            mockRepository.findOne.mockResolvedValue({
                ...mockNavigation,
                lastScrapedAt: null,
            });

            const result = await service.needsScraping(mockNavigation.id);

            expect(result).toBe(true);
        });

        it('should return true if scraped more than maxAgeHours ago', async () => {
            const oldDate = new Date();
            oldDate.setHours(oldDate.getHours() - 25);
            mockRepository.findOne.mockResolvedValue({
                ...mockNavigation,
                lastScrapedAt: oldDate,
            });

            const result = await service.needsScraping(mockNavigation.id, 24);

            expect(result).toBe(true);
        });

        it('should return false if recently scraped', async () => {
            mockRepository.findOne.mockResolvedValue({
                ...mockNavigation,
                lastScrapedAt: new Date(),
            });

            const result = await service.needsScraping(mockNavigation.id, 24);

            expect(result).toBe(false);
        });
    });
});
