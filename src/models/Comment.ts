import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { Post } from "./Post";
import { User } from "./User";

@Table({ tableName: "comments" })
export class Comment extends Model<Comment> {
  @PrimaryKey @Default(uuid) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Post) @Index @Column(DataType.UUID) postId!: string;
  @BelongsTo(() => Post) post!: Post;

  @ForeignKey(() => User) @Index @Column(DataType.UUID) authorId!: string;
  @BelongsTo(() => User) author!: User;

  @Column(DataType.TEXT) body!: string;
  @Default(DataType.NOW) @Column(DataType.DATE) createdAt!: Date;

  @Column(DataType.UUID) parentId?: string | null; // optional threading
}
