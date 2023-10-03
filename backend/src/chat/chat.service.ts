import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomData } from './chat.entity';
import {MessageEventDto, Participant} from "./chat.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(RoomData)
        private roomRepository: Repository<RoomData>,
    ) {}

    async findAllRoom() {
        try {
            const result: RoomData[] = await this.roomRepository.find();
            console.log("ROOMDATA:", result);
            if (!result[0])
                return false;
        } catch (error) {
            console.log("Error while retrieving rooms");
            return null;
        }
        return true;
    }
    
    async remove(id: string): Promise<void> {
        await this.roomRepository.delete(id);
    }

    // async setRoomId(roomId: string) {

    // }

    async saveRoom(room: RoomData) {
        try {
          await this.roomRepository.save(room);
        } catch (error) {
          console.error('Error while saving a room', error);
        }
    }
    
    // async getUsers(id: string) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }

    //     return room.participants;
    // }

    // async getAdmins(id: string) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }

    //     return room.admin;
    // }

    async IsThereARoom(id: string) {
        try {
            const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
            if (!room)
                return false;
        } catch {
            console.log("Error while retrieving the room");
            return false;
        }
        return true;
    }

    async IsThereAPassword(id: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        return room.password;
    }

    // async savePassword(password: string) {
    //     // const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
    //     const saltRounds = 10;
    //     const hashedPassword = await bcrypt.hash(password, saltRounds);
        
    //     return hashedPassword;
    //     // if (!room) {
    //     //     console.error('Room with ID ${id} not found');
    //     //     return null;
    //     // }

    //     // await this.roomRepository.delete(id);

    //     // if (password == null) {
    //     //     room.password = false;
    //     // } else {
    //     //     room.password = true;
    //     //     room.setPassword = hashedPassword;
    //     // }

    //     // await this.roomRepository.save(room);
    //     return true;
    // }

    async verifyPassword(id: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        
        return await bcrypt.compare(password, room.setPassword);
    }

    // async saveMessage(id: string, message: MessageEventDto) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }

    //     await this.roomRepository.delete(id);
    //     room.messages = room.messages.concat(message);
    //     await this.roomRepository.save(room);
    //     return true;
    // }

    // async kick(id: string, User: Participant) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }
        
    //     await this.roomRepository.delete(id);
    //     const index = room.participants.indexOf(User);
    //     if (index > -1)
    //         room.participants.splice(index, 1);
    //     await this.roomRepository.save(room);
    //     return true;
    // }

    // async ban(id: string, userId: number) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }

    //     await this.roomRepository.delete(id);
    //     room.ban = room.ban.concat(userId);
    //     await this.roomRepository.save(room);
    //     return true;
    // }

    // async unban(id: string, userId: number) {
    //     const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
    //     if (!room) {
    //         console.error('Room with ID ${id} not found');
    //         return null;
    //     }
        
    //     await this.roomRepository.delete(id);
    //     const index = room.ban.indexOf(userId);
    //     if (index > -1)
    //         room.ban.splice(index, 1);
    //     await this.roomRepository.save(room);
    //     return true;
    // }
}
