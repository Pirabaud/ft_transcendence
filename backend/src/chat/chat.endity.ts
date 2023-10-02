import { Entity, Column, PrimaryColumn } from 'typeorm';
import {MessageDto} from "./chat.dto";

@Entity()
export class RoomData {
  @PrimaryColumn()
  roomId: string;
  
  @Column()
  createdBy: string;

  @Column()
  createdDate: Date;

	@Column()
	setPassword: string;

	@Column({ nullable: true })
  password?: string;

  @Column()
  messages: Array<MessageDto>;

  @Column()
  participants: Array<number>; // id of Users

	@Column()
  ban: Array<number>; // id of Users

	// @Column()
  // mute: Array<string>;

}