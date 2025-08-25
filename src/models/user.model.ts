import { Table, Column, Model, DataType, Default, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    lastLoginAt?: Date;
}