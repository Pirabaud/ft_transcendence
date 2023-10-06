import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomData } from './chat.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(RoomData)
        private roomRepository: Repository<RoomData>,
    ) {}

    async getAllRoom() {
        var result: RoomData[];
        try {
            result = await this.roomRepository.find();
        } catch (error) {
            console.log("Error while retrieving rooms");
            return null;
        }
        return result;
    }
    
    async remove(id: string): Promise<void> {
        await this.roomRepository.delete(id);
    }

    async saveRoom(room: RoomData) {
        try {
          await this.roomRepository.save(room);
        } catch (error) {
          console.error('Error while saving a room', error);
        }
    }
    
    async getUsers(id: string) {
        const room: RoomData = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        return room.participants;
    }

    // async getUsersId(id: number) {
    //     const room: RoomData = await this.roomRepository.findOne({ where: { roomId: id, }, });

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
            ("Error while retrieving the room");
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

    async verifyPassword(roomId: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        if (room.password == false)
            return { verify: true };
        
        const result = await bcrypt.compare(password, room.setPassword);
        return { verify: result };
    }

    async setPassword(roomId: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        console.log("New Password : " + password);
        if (password == "\0") {
            room.password = false;
            room.setPassword = "";
            await this.roomRepository.save(room);
            return true;
        } else {
            const saltRounds = 10;
            room.password = true;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            room.setPassword = hashedPassword;
            await this.roomRepository.save(room);
            return true;
        }
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

    async addParticipant(id: string, User: number) {
        const room: RoomData = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
        await this.roomRepository.delete(id);
        room.participants.push(User);
        await this.roomRepository.save(room);
        return true;
    }

    async IsParticipantInTheRoom(id: string, User: number) {
        const room: RoomData = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }
       
        var i = 0;
        while (room.participants[i]) {
            if (room.participants[i] == User) {
                return true;
            }
            i++;
        }

        return false;
    }

    async kickParticipant(id: string, User: number): Promise<any> {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });
        
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        await this.roomRepository.delete(id);
        var i = 0;
        while (room.participants[i]) {
            if (room.participants[i] == User) {
                room.participants.splice(i, 1);
            }
            i++;
        }
        i = 0;
        while (room.participants[i]) {
            i++;
        }
        if (i == 0) {
            return { ok: false };
        }
        await this.roomRepository.save(room);
        return { ok: true};
    }

    async addAdmin(admin: number, roomId: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return 0;
        }
        
        if (admin == room.createdBy) {
            console.error('{admin} : is the channel owner');
            return 3;
        }

        var i = 0;
        while (room.admin[i]) {

            if (room.admin[i] == admin) {
                console.error('{admin} : is already admin !');
                return 1;
            }
            i++;
        }

        var i = 0;
        var inRoom: boolean = false;
        while (room.participants[i]) {

            if (room.participants[i] == admin) {
                inRoom = true;
                break;
            }
            i++;
        }
        if (inRoom == false) {
            console.error('{admin} : is not in the room');
            return 2;
        }

        await room.admin.push(admin);
        await this.roomRepository.save(room);
        return 4;
    }

    async removeAdmin(admin: number, roomId: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return 0;
        }

        if (admin == room.createdBy) {
            console.error('{admin} : is the channel owner');
            return 1;
        }
        
        var i = 0;
        var inRoom: boolean = false;
        while (room.participants[i]) {
            
            if (room.participants[i] == admin) {
                inRoom = true;
                break;
            }
            i++;
        }

        if (inRoom == false) {
            console.error('{admin} : is not in the room');
            return 2;
        }

        var i = 0;
        while (room.admin[i]) {

            if (room.admin[i] == admin) {
                room.admin.splice(i, 1);
                await this.roomRepository.save(room);
                return 4;
            }
            i++;
        }
        return 3;
    }

    async getAdmin(admin: number, roomId: string): Promise<any> {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!admin) {
            return null;
        }
        if (!roomId) {
            return null;
        }

        var i = 0;
        if (admin == room.createdBy)
            return { ok: true};
        while (room.admin[i]) {
            if (room.admin[i] == admin) {
                return { ok: true };
            }
            i++;
        }
        return { ok: false };
    }

    async banUser(banner: number, roomId: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return 0;
        }
        
        if (banner == room.createdBy) {
            console.error('{banner} : is the channel owner');
            return 3;
        }

        var i = 0;
        while (room.ban[i]) {

            if (room.ban[i] == banner) {
                console.error('{banner} : is already ban !');
                return 1;
            }
            i++;
        }

        var i = 0;
        var inRoom: boolean = false;
        while (room.participants[i]) {

            if (room.participants[i] == banner) {
                inRoom = true;
                break;
            }
            i++;
        }
        if (inRoom == false) {
            console.error('{banner} : is not in the room');
            return 2;
        }

        await room.ban.push(banner);
        await this.roomRepository.save(room);
        return 4;
    }

    async checkBan(roomId: string, user: number) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        console.log("WTffffff");
        if (!room) {
            console.log("ERROR");
            console.error('Room with ID ${id} not found');
            return false;
        }
        
        var i = 0;
        console.log(user);
        while (room.ban[i]) {
            console.log(room.ban[i]);
            if (room.ban[i] == user) {
                console.error('{user} : is ban !');
                return false;
            }
            i++;
        }
        return true;
    }

    async unBanUser(banner: number, roomId: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return 0;
        }

        if (banner == room.createdBy) {
            console.error('{banner} : is the channel owner');
            return 1;
        }
        
        var i = 0;
        var inRoom: boolean = false;
        while (room.participants[i]) {
            
            if (room.participants[i] == banner) {
                inRoom = true;
                break;
            }
            i++;
        }

        if (inRoom == false) {
            console.error('{banner} : is not in the room');
            return 2;
        }

        var i = 0;
        while (room.ban[i]) {

            if (room.ban[i] == banner) {
                room.ban.splice(i, 1);
                await this.roomRepository.save(room);
                return 4;
            }
            i++;
        }
        return 3;
    }
}
