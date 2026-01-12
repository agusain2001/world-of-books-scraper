import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Navigation } from './navigation.entity';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    url: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ type: 'int', default: 0 })
    productCount: number;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Index()
    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Self-referencing relationship for subcategories
    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category;

    @Column({ type: 'uuid', nullable: true })
    parentId: string;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    // Relationship with Navigation
    @ManyToOne(() => Navigation, (navigation) => navigation.categories, { nullable: true })
    @JoinColumn({ name: 'navigationId' })
    navigation: Navigation;

    @Column({ type: 'uuid', nullable: true })
    navigationId: string;

    // Products in this category
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
