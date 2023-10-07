import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface Participant {
  userId: number;
  username: string;
  avatar: string;
  status: string,
}

export interface MessageEvent {
  socketId: string;
  roomId: string;
  user: Participant;
  content: string;
  createdAt: Date;
}

@Entity()
export class RoomData {
  @PrimaryColumn()
  roomId: string;
  
  @Column()
  createdBy: number;

	@Column()
	setPassword: string;
  
	@Column({ nullable: true })
  password?: boolean;
  
  @Column('simple-array', { nullable: true })
  participants: Array<number>;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public messages!: Array<MessageEvent>;
  
  @Column('simple-array', { nullable: true })
  admin: Array<number>;

	@Column('simple-array', {nullable: true })
  ban: Array<number>; // id of Users

  @Column('simple-array', {nullable: true })
  mute: Array<number>; // id of Users
  
  // @Column()
  // createdDate: Date;

  // @Column()
  // mute: Array<string>;
}