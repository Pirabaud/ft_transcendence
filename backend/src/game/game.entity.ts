import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class GameHistory {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true})
    winner: number;

    @Column({ nullable: true})
    loser: number;

    @Column()
    winnerScore: number;

    @Column()
    loserScore: number;
}