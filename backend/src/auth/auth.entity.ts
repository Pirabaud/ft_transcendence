import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class QRcode {
    @PrimaryColumn()
    secret: string;

    @Column()
    imageURL: string;

}
