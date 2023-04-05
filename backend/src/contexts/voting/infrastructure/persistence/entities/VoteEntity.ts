import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('votes')
export class VoteEntity {

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
}
