import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Follow } from "./Follow";
import { v4 as uuid } from "uuid";

@Table({ tableName: "users" })
export class User extends Model<User> {
  @PrimaryKey @Default(uuid) @Column(DataType.UUID) id!: string;
  @Unique @Column(DataType.STRING) username!: string;
  @Unique @Column(DataType.STRING) email!: string;
  @Column(DataType.STRING) password!: string;

  @HasMany(() => Post) posts!: Post[];
  @HasMany(() => Comment) comments!: Comment[];
  @HasMany(() => Like) likes!: Like[];
  @HasMany(() => Follow, "followerId") followings!: Follow[];
  @HasMany(() => Follow, "followingId") followers!: Follow[];
}
