import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomData } from './chat.entity';
import {MessageEventDto} from "./chat.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(RoomData)
        private roomRepository: Repository<RoomData>,
    ) {}

    findAllRoom(): Promise<RoomData[]> {
        return this.roomRepository.find();
    }

    async remove(id: string): Promise<void> {
        await this.roomRepository.delete(id);
    }

    async getUsers(id: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        return room.participants;
    }

    async getAdmins(id: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        return room.admin;
    }

    async IsThereAPassword(id: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        return room.password;
    }

    async savePassword(id: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        await this.roomRepository.delete(id);

        if (password == null) {
            room.password = false;
        } else {
            room.password = true;
            room.setPassword = hashedPassword;
        }

        await this.roomRepository.save(room);
        return true;
    }

    async verifyPassword(id: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        
        return await bcrypt.compare(password, room.setPassword);
    }

    async saveMessage(id: string, message: MessageEventDto) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        await this.roomRepository.delete(id);
        room.messages = room.messages.concat(message);
        await this.roomRepository.save(room);
        return true;
    }

    async kick(id: string, userId: number) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        
        await this.roomRepository.delete(id);
        const index = room.participants.indexOf(userId);
        if (index > -1)
            room.participants.splice(index, 1);
        await this.roomRepository.save(room);
        return true;
    }

    async ban(id: string, userId: number) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        await this.roomRepository.delete(id);
        room.ban = room.ban.concat(userId);
        await this.roomRepository.save(room);
        return true;
    }

    async unban(id: string, userId: number) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        
        await this.roomRepository.delete(id);
        const index = room.ban.indexOf(userId);
        if (index > -1)
            room.ban.splice(index, 1);
        await this.roomRepository.save(room);
        return true;
    }
}
