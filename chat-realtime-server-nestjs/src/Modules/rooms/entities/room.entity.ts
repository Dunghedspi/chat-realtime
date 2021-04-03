import { Table, Model, Column, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import { User } from "../../users/entities/user.entity";
import { UserRoom } from '../../user-room/entities/user-room.entity';
import { Exclude } from 'class-transformer';
import { Message } from '../../message/entities/message.entity';

@Table({
    tableName: "rooms",
    paranoid: true
})
export class Room extends Model{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        unique: false,
    })
    @Exclude()
    code: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @BelongsToMany(() => User, {through: () => UserRoom, foreignKey: {name: "room_id", field: "room_id"}, as: "users"})
    users: User[]

}
