import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    sourceId: string;

    @Column({ type: 'varchar', length: 500 })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    originalPrice: number;

    @Column({ type: 'varchar', length: 10, default: 'GBP' })
    currency: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Index()
    @Column({ type: 'varchar', length: 500, unique: true })
    sourceUrl: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    condition: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    format: string;

    @Column({ type: 'boolean', default: true })
    inStock: boolean;

    @Index()
    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relationship with Category
    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    // One-to-one relationship with ProductDetail
    @OneToOne(() => ProductDetail, (detail) => detail.product, { cascade: true })
    detail: ProductDetail;

    // One-to-many relationship with Reviews
    @OneToMany(() => Review, (review) => review.product, { cascade: true })
    reviews: Review[];
}
