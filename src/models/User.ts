import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  sessionId: string;
  ip: string;
  email: string;
  password: string; 
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);