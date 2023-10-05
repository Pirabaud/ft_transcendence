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

    async verifyPassword(id: string, password: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: id, }, });

        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
        }

        if (room.password == false)
            return { verify: true };
        
        const result = await bcrypt.compare(password, room.setPassword);
        return { verify: result };
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

    async kickParticipant(id: string, User: number) {
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
        await this.roomRepository.save(room);
        return true;
    }

    async addAdmin(admin: number, roomId: string) {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });
        if (!room) {
            console.error('Room with ID ${id} not found');
            return null;
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
        if (admin == room.createdBy) {
            console.error('{admin} : is the channel owner');
            return 3;
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
    async getAdmin(admin: number, roomId: string): Promise<boolean> {
        const room = await this.roomRepository.findOne({ where: { roomId: roomId, }, });

        var i = 0;
        if (admin == room.createdBy)
            return true;
        while (room.admin[i]) {
            if (room.admin[i] == admin) {
                return true;
            }
            i++;
        }
        return false;
    }

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
