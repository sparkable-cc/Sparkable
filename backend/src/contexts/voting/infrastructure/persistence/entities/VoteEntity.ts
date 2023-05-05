import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteDto } from '../../../domain/models/VoteDto';

@Entity('votes')
export class VoteEntity implements VoteDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  linkUuid: string;

  @Column()
  cycle: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column({nullable: true})
  userStage: number;

  @Column({nullable: true})
  linkStage: number;
}
