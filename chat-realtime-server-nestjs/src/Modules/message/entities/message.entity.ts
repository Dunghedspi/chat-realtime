import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { UserMessage } from './user-message.entity';

@Table({
  paranoid: true,
  tableName: 'messages',
})
export class Message extends Model {
  [x: string]: any;
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;
  @Column({
    defaultValue: 'text',
    type: DataType.STRING,
  })
  type: string;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => Room, 'room_id')
  room: Room;

  @BelongsToMany(() => User, {
    through: () => UserMessage,
    foreignKey: { name: 'message_id', field: 'message_id' },
    as: 'users',
  })
  users: User[];
}
