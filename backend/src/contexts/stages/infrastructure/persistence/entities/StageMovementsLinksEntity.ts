import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StageMovementsLinksDto } from '../../../domain/models/StageMovementsLinksDto';

@Entity('stage_movements_links')
export class StageMovementsLinksEntity implements StageMovementsLinksDto {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column()
  linkUuid: string;

  @Column()
  oldStage: number;

  @Column()
  newStage: number;

  @Column()
  cycle: number;
}
