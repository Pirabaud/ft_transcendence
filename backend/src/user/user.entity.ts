import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;
  
  @Column({ nullable: true})
  login: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true})
   img: string;

  @Column("simple-array", {nullable: true})
  matchHistory: string[];

}

