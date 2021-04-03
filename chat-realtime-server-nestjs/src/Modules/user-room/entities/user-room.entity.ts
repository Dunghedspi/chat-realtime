import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Table({
  paranoid: true,
  tableName: 'user_room',
})
export class UserRoom extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(()=>User)
  user_id: number;

  @ForeignKey(()=>Room)
  room_id: number;

  @BelongsTo(()=>Room, {foreignKey: "room_id", as: "room"})
  room: Room

  @BelongsTo(()=>User, {foreignKey: "user_id", as: "user"})
  user: User
}
