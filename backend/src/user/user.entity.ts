import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  img: string;

  @Column()
  friendRequestsNb: number;

  @Column({ nullable: true })
  friendList: string;
}
