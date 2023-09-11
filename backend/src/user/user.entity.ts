import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Match } from 'src/game/interfaces/match.interface';

@Entity()
export class User {
    @PrimaryColumn()
    id:number;

    @Column()
    login: string;

    @Column({ nullable: true })
    username?: string;

    @Column()
    img: string;

    @Column()
    tfa: boolean;

}
