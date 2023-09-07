import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column("text", { nullable: true})
  login: string;

  @Column("text", { nullable: true })
  username?: string;

  @Column("text", { nullable: true})
  img: string;

  @Column("text", {array: true, nullable: true})
  matchHistory: string[];

}