import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import {Socket} from 'socket.io';
import {Participant, MessageEvent} from "./chat.dto";
import { UserService } from 'src/user/user.service';
import {ChatService} from "./chat.service";
import { RoomData } from 'src/chat/chat.entity';
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


    handleConnection(socket: Socket): void {
        const socketId = socket.id;
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
    }

    @SubscribeMessage('participant')
    async onParticipate(socket: Socket, room: any) {
        const socketId = socket.id;
        this.server.emit(`participant/${room.roomID}`, room.user);
    }

    @SubscribeMessage('leave')
    async onLeave(socket: Socket, room: any) {
        const socketId = socket.id;
        this.server.emit(`leave/${room.roomID}`, room.userID);
    }

    @SubscribeMessage('kick')
    async onKick(socket: Socket, room: any) {
        const socketId = socket.id;
        this.server.emit(`kick/${room.roomID}`, room.userID);
    }

    @SubscribeMessage('exchanges')
    async onMessage(socket: Socket, message: MessageEvent) {
        const socketId = socket.id;
        message.socketId = socketId;

        this.chatService.saveMessage(message.roomId, message)
        this.server.emit(message.roomId, message);
    }
    
    @SubscribeMessage('joinRoom')
    async joinRoom(channel: any, room: any) {

        console.log(room.user);

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

        const sol: boolean = await this.chatService.checkBan(room.channel, room.user);
        if (sol == false) {
            // YOU ARE BAN
            return 4;
        }

        // Add the participant
        await this.chatService.addParticipant(room.channel, room.user);

        return 5;
    }
    
    @SubscribeMessage('newRoom')
    async newRoom(channel: any, room: any) {
        
        var pass: boolean = false;
        var hashedPassword: string = '';
        const saltRounds = 10;
        
        if (await this.chatService.IsThereARoom(room.channel)) {
            // THIS ROOM ALREADY EXIST
            return -1;
        }

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
            messages: [],
            admin: [],
            ban: [],
            mute: [],
        };
        await this.chatService.saveRoom(newData);
        
        return 42;
    }
    
    @SubscribeMessage('leaveRoom')
    async leaveRoom(channel: any, room: any): Promise<any> {
        return await this.chatService.kickParticipant(room.channel, room.user);
    }
    
    @SubscribeMessage('addAdmin')
    async addAdmin(socket: Socket, room: any) {
        return await this.chatService.addAdmin(room.user, room.id);
    }
    
    @SubscribeMessage('removeAdmin')
    async removeAdmin(socket: Socket, room: any) {
        return await this.chatService.removeAdmin(room.user, room.id);
    }
    
    @SubscribeMessage('getAdmin')
    async getAdmin(socket: Socket, room: any): Promise<any> {
        return await this.chatService.getAdmin(room.user, room.id);
    }

    @SubscribeMessage('setPassword')
    async setPassword(socket: Socket, pass: any): Promise<any> {
        return await this.chatService.setPassword(pass.id, pass.psd);
    }
    
    @SubscribeMessage('verifyPassword')
    async verifyPassword(socket: Socket, pass: any): Promise<any> {
        return await this.chatService.verifyPassword(pass.id, pass.psd);
    }
    
    @SubscribeMessage('banUser')
    async banUser(socket: Socket, room: any) {
        return await this.chatService.banUser(room.user, room.id);
    }
    
    @SubscribeMessage('unBanUser')
    async unBanUser(socket: Socket, room: any) {
        return await this.chatService.unBanUser(room.user, room.id);
    }

    @SubscribeMessage('muteUser')
    async muteUser(socket: Socket, room: any) {
        return await this.chatService.muteUser(room.user, room.id);
    }

    // @SubscribeMessage('getUser')
    // async getUser(socket: Socket, user: any) {
    //     return await this.chatService.getUser(user);
    // }

    @SubscribeMessage('unMuteUser')
    async unMuteUser(socket: Socket, room: any) {
        return await this.chatService.unMuteUser(room.user, room.id);
    }

    @SubscribeMessage('checkMute')
    async checkMute(socket: Socket, room: any) {
        return await this.chatService.checkMute(room.user, room.id);
    }
    
    @SubscribeMessage('blockUser')
    async blockUser(socket: Socket, room: any) {
        return await this.chatService.blockUser(room.userId, room.userData);
    }
    
    @SubscribeMessage('unBlockUser')
    async unBlockUser(socket: Socket, room: any) {
        return await this.chatService.unBlockUser(room.userId, room.userData);
    }

    @SubscribeMessage('checkBlock')
    async checkBlock(socket: Socket, room: any) {
        return await this.chatService.checkBlock(room.userId, room.userData);
    }

    @SubscribeMessage('getAllParticipants')
    async getAllParticipants(channel: any, room: any): Promise<Array<number>> {
        
        const Users: Array<number> = await this.chatService.getUsers(room.channel);
        
        return Users;
    }

    // @SubscribeMessage('getAllMessages')
    // async getAllMessages(socket: Socket, room: any): Promise<MessageEvent[]> {
    //     return await this.chatService.getMessages(room.channel);
    // }
    
}
