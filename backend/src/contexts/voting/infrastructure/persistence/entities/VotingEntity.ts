import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VotingDto } from '../../../domain/models/VotingDto';

@Entity('voting')
export class VotingEntity implements VotingDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  cycle: number;

  @Column()
  countVotes: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;
}
