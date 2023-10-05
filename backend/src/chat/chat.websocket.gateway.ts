import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import {Socket} from 'socket.io';
import {ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {Participant, ChatDto, toMessageDto, MessageDto, MessageEventDto} from "./chat.dto";
import { UserService } from 'src/user/user.service';
import {ChatService} from "./chat.service";
import { RoomData } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

// INCROYABLE A NE PAS PERDRE 
@WebSocketGateway({
    cors: {
      origin: 'http://localhost:4200',
      methods: ['*'],
    },
  })


@WebSocketGateway()
export class ChatWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    constructor (
        private chatService: ChatService,
        private userService: UserService,
    ) {}

    @WebSocketServer() server;

    // private static rooms: Map<string, RoomData> = new Map();
    // private static participants: Map<string, string> = new Map(); // sockedId => roomId

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        console.log(`New connecting... socket id:`, socketId);
        // ChatWebsocketGateway.participants.set(socketId, '');
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
        console.log(`Disconnection... socket id:`, socketId);
        // const roomId = ChatWebsocketGateway.participants.get(socketId);
        // const room = ChatWebsocketGateway.rooms.get(roomId);
        // if (room) {
        //     room.participants.get(socketId).connected = false;
        //     this.server.emit(
        //         `participants/${roomId}`,
        //         Array.from(room.participants.values()),
        //     );
        // }
    }

    @SubscribeMessage('participants')
    async onParticipate(socket: Socket, participant: Participant) {
        const socketId = socket.id;
        console.log(
            `Registering new participant... socket id: %s and participant: `,
            socketId,
            participant,
        );

        // const roomId = participant.roomId;
        // if (!ChatWebsocketGateway.rooms.has(roomId)) {
        //     console.error('Room with id: %s was not found, disconnecting the participant', roomId);
        //     socket.disconnect();
        //     throw new ForbiddenException('The access is forbidden');
        // }

        // const room = ChatWebsocketGateway.rooms.get(roomId);
        // ChatWebsocketGateway.participants.set(socketId, roomId);
        // participant.connected = true;
        // room.participants.set(socketId, participant);
        // // when received new participant we notify the chatter by room
        // this.server.emit(
        //     `participants/${roomId}`,
        //     Array.from(room.participants.values()),
        // );
    }

    @SubscribeMessage('exchanges')
    async onMessage(socket: Socket, message: ChatDto) {
        const socketId = socket.id;
        message.socketId = socketId;
        console.log(
            'Received new message... socketId: %s, message: ',
            socketId,
            message,
        );
        // const roomId = message.roomId;
        // const roomData = ChatWebsocketGateway.rooms.get(roomId);
        // message.order = roomData.messages.length + 1;
        // roomData.messages.push(message);
        // ChatWebsocketGateway.rooms.set(roomId, roomData);
        // // when received message we notify the chatter by room
        // this.server.emit(roomId, toMessageDto(message));
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(channel: any, room: any) {

        if (await this.chatService.IsThereARoom(room.channel) == false) {
            // THIS ROOM DOESN'T EXIST
            return 1;
        }
        
        const verify = await this.chatService.verifyPassword(room.channel, room.password);
        
        if (verify.verify == false) {
            // WRONG PASSWORD
            return 2
        }

        const ok: boolean = await this.chatService.IsParticipantInTheRoom(room.channel, room.user);
        if (ok) {
            // YOU'RE ALREADY IN THE ROOM
            return 3;
        }

        // Add the participant
        await this.chatService.addParticipant(room.channel, room.user);

        return 4;
    }

    @SubscribeMessage('newRoom')
    async newRoom(channel: any, room: any) {
        
        var pass: boolean = false;
        var hashedPassword: string = '';
        const saltRounds = 10;
        
        if (await this.chatService.IsThereARoom(room.channel) == true) {
            console.log("THIS ROOM ALREADY EXIST");
            return null;
        }

        console.log("Creating chat room...");
        if (room.password != "")
        {
            pass = true;
            hashedPassword = await bcrypt.hash(room.password, saltRounds);
        }
        
        const newData: RoomData = {
            roomId: room.channel,
            createdBy: room.userId,
            setPassword: hashedPassword,
            password: pass,
            participants: [room.userId,],
            // messages: [],
            admin: [],
            // ban: [],
        };
        await this.chatService.saveRoom(newData);


        return true;
    }

    @SubscribeMessage('leaveRoom')
    async leaveRoom(channel: any, room: any) {
        
        await this.chatService.kickParticipant(room.channel, room.user);
    }

    @SubscribeMessage('addAdmin')
    async addAdmin(socket: Socket, room: any) {
        return await this.chatService.addAdmin(room.user, room.id);
    }
    
    @SubscribeMessage('getAllParticipants')
    async getAllParticipants(channel: any, room: any): Promise<Array<number>> {

        const Users: Array<number> = await this.chatService.getUsers(room.channel);

        return Users;
    }
    
}
