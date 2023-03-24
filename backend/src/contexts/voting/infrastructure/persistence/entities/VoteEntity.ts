import { listenerCount } from 'process';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkDto } from '../../../../links/domain/models/LinkDto';
import { VoteDto } from '../../../domain/models/VoteDto';

@Entity('votes')
export class VoteEntity implements VoteDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  cycle: number;

  @Column()
  count: number;

  A LO MEJOR NECESITAMOS DOS ENTITIES REALMENTE EN ESTE CASO!!!
  - UNA VOTACION CON LOS LINKS UUID (VOTING ENTITY)
  - OTRA CON CADA VOTO INDIVIDUAL (VOTE ENTITY)
  @Column()
  votes: LinkDto[];

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

}
