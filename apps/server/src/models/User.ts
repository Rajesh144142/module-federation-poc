import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
}

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
