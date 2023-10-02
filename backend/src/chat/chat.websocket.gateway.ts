import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import {Socket} from 'socket.io';
import {ConflictException, ForbiddenException, NotFoundException} from '@nestjs/common';
import {Participant, ChatDto, toMessageDto, RoomData, RoomDto, MessageDto} from "./chat.dto";
import {ChatService} from "./chat.service";

// INCROYABLE A NE PAS PERDRE 
@WebSocketGateway({
    cors: {
      origin: 'http://localhost:4200',
      methods: ['*'],
    },
  })


@WebSocketGateway()
export class ChatWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer() server;

    private static rooms: Map<string, RoomData> = new Map();
    private static participants: Map<string, string> = new Map(); // sockedId => roomId

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        console.log(`New connecting... socket id:`, socketId);
        ChatWebsocketGateway.participants.set(socketId, '');
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
        console.log(`Disconnection... socket id:`, socketId);
        const roomId = ChatWebsocketGateway.participants.get(socketId);
        const room = ChatWebsocketGateway.rooms.get(roomId);
        if (room) {
            room.participants.get(socketId).connected = false;
            this.server.emit(
                `participants/${roomId}`,
                Array.from(room.participants.values()),
            );
        }
    }

    @SubscribeMessage('participants')
    async onParticipate(socket: Socket, participant: Participant) {
        const socketId = socket.id;
        console.log(
            `Registering new participant... socket id: %s and participant: `,
            socketId,
            participant,
        );

        const roomId = participant.roomId;
        if (!ChatWebsocketGateway.rooms.has(roomId)) {
            console.error('Room with id: %s was not found, disconnecting the participant', roomId);
            socket.disconnect();
            throw new ForbiddenException('The access is forbidden');
        }

        const room = ChatWebsocketGateway.rooms.get(roomId);
        ChatWebsocketGateway.participants.set(socketId, roomId);
        participant.connected = true;
        room.participants.set(socketId, participant);
        // when received new participant we notify the chatter by room
        this.server.emit(
            `participants/${roomId}`,
            Array.from(room.participants.values()),
        );
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
        const roomId = message.roomId;
        const roomData = ChatWebsocketGateway.rooms.get(roomId);
        message.order = roomData.messages.length + 1;
        roomData.messages.push(message);
        ChatWebsocketGateway.rooms.set(roomId, roomData);
        // when received message we notify the chatter by room
        this.server.emit(roomId, toMessageDto(message));
    }

    @SubscribeMessage('room')
    async newRoom(roomDto: RoomDto) {
        console.log("Creating chat room...");
        try {
            ChatWebsocketGateway.createRoom(roomDto);
            console.log("All is Good");
        } catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
        // return ChatService.getMessages("oui");
        // this.server.emit("fill data", ChatService.getMessages("oui"));
        //         try {
        //     // return ChatService.getMessages(roomId, fromIndex, toIndex);
        //     return ChatService.getMessages("roomid");
        // // } catch (e) {
        // //     console.error('Failed to get room messages', e);
        // //     throw new ForbiddenException({code: 'access-forbidden', message: 'The access is forbidden'});
        // // }
    }

    static get(roomId: string): RoomData {
        return this.rooms.get(roomId);
    }

    static createRoom(roomDto: RoomDto): void {
        const roomId = "oui";
        roomDto.creatorUsername = "luserbu";
        roomDto.roomId = "oui";
        if (this.rooms.has(roomId)) {
            throw new ConflictException({code: 'room.conflict', message: `Room with '${roomId}' already exists`})
        }
        this.rooms.set(roomId, new RoomData(roomDto.creatorUsername));
    }

    static close(roomId: string) {
        if (!this.rooms.has(roomId)) {
            throw new NotFoundException({code: 'room.not-fond', message: `Room with '${roomId}' not found`})
        }
        this.rooms.delete(roomId);
    }
}
