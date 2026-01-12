import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('navigations')
export class Navigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  lastScrapedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.navigation)
  categories: Category[];
}
