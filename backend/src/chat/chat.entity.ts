import { Entity, Column, PrimaryColumn } from 'typeorm';

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
  
  // @Column({ nullable: true })
  // messages: MessageDto[];
  
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