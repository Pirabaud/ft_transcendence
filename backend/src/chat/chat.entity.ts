import { Entity, Column, PrimaryColumn } from 'typeorm';
import {MessageDto, Participant} from "./chat.dto";

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
}
  
  // @Column({ nullable: true })
  // messages: MessageDto[];
  
  // @Column({ nullable: true })
  // admin: number[];

	// @Column({ nullable: true })
  // ban: number[]; // id of Users
  
  // @Column()
  // createdDate: Date;

  // @Column()
  // mute: Array<string>;

