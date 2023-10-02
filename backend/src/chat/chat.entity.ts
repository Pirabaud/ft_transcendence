import { Entity, Column, PrimaryColumn } from 'typeorm';
import {MessageDto} from "./chat.dto";

@Entity()
export class RoomData {
  @PrimaryColumn()
  roomId: string;
  
  @Column()
  createdBy: string;

	@Column()
	setPassword: string;
  
	@Column({ nullable: true })
  password?: boolean;
  
  @Column()
  messages: Array<MessageDto>;
  
  @Column()
  participants: Array<number>; // id of Users
  
  @Column()
  admin: Array<number>;

	@Column()
  ban: Array<number>; // id of Users
  
  // @Column()
  // createdDate: Date;

  // @Column()
  // mute: Array<string>;

}
