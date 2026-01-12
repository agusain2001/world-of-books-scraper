import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum ScrapeJobStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

export enum ScrapeTargetType {
    NAVIGATION = 'navigation',
    CATEGORY = 'category',
    PRODUCT_LIST = 'product_list',
    PRODUCT_DETAIL = 'product_detail',
}

@Entity('scrape_jobs')
export class ScrapeJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500 })
    targetUrl: string;

    @Column({
        type: 'enum',
        enum: ScrapeTargetType,
        default: ScrapeTargetType.NAVIGATION,
    })
    targetType: ScrapeTargetType;

    @Index()
    @Column({
        type: 'enum',
        enum: ScrapeJobStatus,
        default: ScrapeJobStatus.PENDING,
    })
    status: ScrapeJobStatus;

    @Column({ type: 'int', default: 0 })
    itemsScraped: number;

    @Column({ type: 'int', default: 0 })
    retryCount: number;

    @Column({ type: 'int', default: 3 })
    maxRetries: number;

    @Column({ type: 'timestamp', nullable: true })
    startedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    finishedAt: Date;

    @Column({ type: 'text', nullable: true })
    errorLog: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
