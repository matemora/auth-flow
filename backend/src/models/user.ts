import { model, Schema, Document } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  privateContent: boolean;
}

export interface IUserDoc extends Document, IUser { }

const userSchema = new Schema({
  email: String,
  password: String,
  privateContent: Boolean,
});

export const UserModel = model<IUserDoc>('User', userSchema);