import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  img: string;

  @Column()
  tfa: boolean;

  @Column({ nullable: true })
  secret?: string;

  @Column({ nullable: true })
  QRcode?: string;

  @Column()
  elo: number;

  @Column()
  win: number;

  @Column()
  lose: number;

  @Column('simple-array', { nullable: true })
  matchHistory: string[];

  @Column({ nullable: true })
  friendRequestsNb: number;

  @Column('simple-array', { nullable: true })
  friendList: number[];

  @Column({ nullable: true })
  status: string;

  // Chat
  @Column('simple-array', { nullable: true })
  blockUser: Array<number>;

  @Column({ nullable: true })
  gameStatus: boolean;

  @Column({ nullable: true })
  currentGameId: string;

  @Column({ nullable: true })
  currentOpponentId: number;
}