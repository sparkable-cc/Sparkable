import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StageMovementDto } from '../../../domain/models/StageMovementDto';

@Entity('stage_movements_links')
export class StageMovementsLinksEntity implements StageMovementDto {
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
