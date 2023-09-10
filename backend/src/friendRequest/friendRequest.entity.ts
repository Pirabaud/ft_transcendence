import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: number;

  @Column()
  receiver: number;

  @Column()
  status: string;
}
