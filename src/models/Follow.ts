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

@Table({ tableName: "follows", timestamps: false })
export class Follow extends Model<Follow> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  followerId!: string;
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  followingId!: string;

  @BelongsTo(() => User, "followerId") follower!: User;
  @BelongsTo(() => User, "followingId") following!: User;
}
