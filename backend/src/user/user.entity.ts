import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  login: string;

  @Column({ nullable: true })
  username?: string;

   @Column()
   img: string;
}
