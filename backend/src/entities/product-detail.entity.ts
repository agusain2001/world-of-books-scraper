import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_details')
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    publisher: string;

    @Column({ type: 'date', nullable: true })
    publicationDate: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    isbn: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    isbn13: string;

    @Column({ type: 'int', nullable: true })
    pages: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    language: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    dimensions: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    weight: string;

    @Column({ type: 'jsonb', nullable: true })
    specs: Record<string, any>;

    @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
    ratingsAvg: number;

    @Column({ type: 'int', default: 0 })
    reviewsCount: number;

    @Column({ type: 'jsonb', nullable: true })
    relatedProducts: { sourceId: string; title: string; url: string }[];

    @Column({ type: 'jsonb', nullable: true })
    recommendedProducts: { sourceId: string; title: string; url: string }[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relationship with Product
    @OneToOne(() => Product, (product) => product.detail)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'uuid' })
    productId: string;
}
