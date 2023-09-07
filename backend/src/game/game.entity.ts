import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class GameHistory {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true})
    winner: string;

    @Column({ nullable: true})
    loser: string;

    @Column()
    winnerScore: number;

    @Column()
    loserScore: number;
}