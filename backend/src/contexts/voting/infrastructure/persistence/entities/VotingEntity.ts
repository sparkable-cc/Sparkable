import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('voting')
export class VotingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  cycle: number;

  @Column()
  count: number;

  @Column()
  votes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

}
