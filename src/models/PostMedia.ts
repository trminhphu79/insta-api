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

@Table({ tableName: "post_media" })
export class PostMedia extends Model<PostMedia> {
  @PrimaryKey @Default(uuid) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Post) @Index @Column(DataType.UUID) postId!: string;
  @BelongsTo(() => Post) post!: Post;

  @Column(DataType.TEXT) url!: string;
  @Column(DataType.ENUM("image", "video")) type!: "image" | "video";
  @Default(0) @Column(DataType.INTEGER) position!: number; // order
  @Column(DataType.INTEGER) width?: number;
  @Column(DataType.INTEGER) height?: number;
}
