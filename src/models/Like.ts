import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";

@Table({ tableName: "likes", timestamps: false })
export class Like extends Model<Like> {
  @PrimaryKey @ForeignKey(() => User) @Column(DataType.UUID) userId!: string;
  @PrimaryKey @ForeignKey(() => Post) @Column(DataType.UUID) postId!: string;

  @BelongsTo(() => User) user!: User;
  @BelongsTo(() => Post) post!: Post;
}
