import {ConflictException, NotFoundException} from '@nestjs/common';
import {MessageDto, toMessageDto} from "./chat.dto";
import {ChatWebsocketGateway} from "./chat.websocket.gateway";

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomData } from './chat.endity';

export class ChatService {

    constructor(
        @InjectRepository(RoomData)
        private roomRepository: Repository<RoomData>,
    ) {}

    findAllRoom(): Promise<RoomData[]> {
        return this.roomRepository.find();
    }

    async remove(id: number): Promise<void> {
        await this.roomRepository.delete(id);
    }

    // constructor() {
    // }
    // //  fromIndex: number, toIndex: number
    // getMessages(roomId: string): MessageDto[] {
    //     const room = ChatWebsocketGateway.get(roomId);
    //     console.log("la room", room);
    //     if (!room) {
    //         throw new NotFoundException({code: 'room.not-fond', message: 'Room not found'})
    //     }
    //     return room.messages
    //         // .filter((value, index) => index >= fromIndex - 1 && index < toIndex)
    //         .map(toMessageDto);
    // }


}

// export const chatService = new ChatService();
