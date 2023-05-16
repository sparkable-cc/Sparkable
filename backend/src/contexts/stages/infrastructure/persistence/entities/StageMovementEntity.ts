import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StageMovementDto } from '../../../domain/models/StageMovementDto';

@Entity('stage_movements_links')
export class StageMovementEntity implements StageMovementDto {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column({nullable: true})
  linkUuid: string;

  @Column({nullable: true})
  userUuid: string;

  @Column()
  oldStage: number;

  @Column()
  newStage: number;

  @Column()
  cycle: number;
}
