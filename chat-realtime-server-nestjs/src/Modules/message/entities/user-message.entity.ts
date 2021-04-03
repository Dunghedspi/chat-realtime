import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Table({
  paranoid: true,
  tableName: 'user-messages',
  modelName: 'user-messages',
})
export class UserMessage extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  user_id: number;

  @ForeignKey(() => Message)
  message_id: number;

  @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
  user: User;

  @BelongsTo(() => Message, { foreignKey: 'message_id', as: 'message' })
  message: Message;
}
