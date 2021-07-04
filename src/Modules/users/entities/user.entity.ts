import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Room } from '../../rooms/entities/room.entity';
import { UserRoom } from '../../user-room/entities/user-room.entity';
import { Message } from '../../message/entities/message.entity';
import { UserMessage } from 'src/Modules/message/entities/user-message.entity';
import { ConfigService } from '@nestjs/config';
@Table({
  paranoid: true,
  tableName: 'users',
  modelName: 'users',
})
export class User extends Model {  
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column
  get avatar(): string {
    const filename =
      this.getDataValue('avatar') == null
        ? 'avatardefault.jpg'
        : this.getDataValue('avatar');
    return `/users/avatar/` + filename;
  }

  set avatar(value: string) {
    this.setDataValue('avatar', value);
  }

  @BelongsToMany(() => Room, {
    through: () => UserRoom,
    foreignKey: { name: 'user_id', field: 'user_id' },
    as: 'rooms',
  })
  room: Room[];

  @BelongsToMany(() => Message, {
    through: () => UserMessage,
    foreignKey: { name: 'user_id', field: 'user_id' },
    as: 'messages',
  })
  users: User[];
}
