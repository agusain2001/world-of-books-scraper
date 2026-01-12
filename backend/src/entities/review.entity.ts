import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;

    @Column({ type: 'int', nullable: true })
    rating: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    text: string;

    @Column({ type: 'date', nullable: true })
    reviewDate: Date;

    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @Index()
    @CreateDateColumn()
    createdAt: Date;

    // Relationship with Product
    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'uuid' })
    productId: string;
}
