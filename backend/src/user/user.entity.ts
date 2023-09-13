import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true})
   img: string;

  @Column()
    elo: number;

  @Column()
    win: number;

  @Column()
    lose: number;

  @Column("simple-array", {nullable: true})
  matchHistory: string[];

  @Column()
  friendRequestsNb: number;

  @Column('simple-array', { nullable: true })
  friendList: number[];
}

