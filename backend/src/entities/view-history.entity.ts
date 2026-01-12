import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('view_history')
export class ViewHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    userId: string;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    sessionId: string;

    @Column({ type: 'varchar', length: 500 })
    path: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    pageType: string; // 'navigation', 'category', 'product', etc.

    @Column({ type: 'uuid', nullable: true })
    entityId: string; // The ID of the viewed entity (product, category, etc.)

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @Index()
    @CreateDateColumn()
    createdAt: Date;
}
