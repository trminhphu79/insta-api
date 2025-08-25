import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { User } from "./User";
import { PostMedia } from "./PostMedia";
import { Comment } from "./Comment";
import { Like } from "./Like";

export enum PostVisibility {
  PUBLIC = "public",
  FOLLOWERS = "followers",
}

@Table({ tableName: "posts" })
export class Post extends Model<Post> {
  @PrimaryKey @Default(uuid) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @Index @Column(DataType.UUID) authorId!: string;
  @BelongsTo(() => User) author!: User;

  @Column(DataType.TEXT) caption!: string | null;
  @Column(DataType.ENUM("public", "followers")) visibility!: PostVisibility;

  @Default(0) @Column(DataType.INTEGER) likeCount!: number;
  @Default(0) @Column(DataType.INTEGER) commentCount!: number;

  @Index @Default(DataType.NOW) @Column(DataType.DATE) createdAt!: Date;

  @HasMany(() => PostMedia) media!: PostMedia[];
  @HasMany(() => Comment) comments!: Comment[];
  @HasMany(() => Like) likes!: Like[];
}
