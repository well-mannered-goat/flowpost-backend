import { model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    insta_access_token?:string;
    yt_access_token?:string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    insta_access_token: {type: String, required: false},
    yt_access_token: {type: String, required: false}
});

export const User = model<IUser>('User', userSchema);
