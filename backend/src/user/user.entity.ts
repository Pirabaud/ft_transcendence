import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  username?: string;

  @Column()
  img: string;
}
