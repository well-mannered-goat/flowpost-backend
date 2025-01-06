import { model, mongo, Schema } from "mongoose";
import { User } from "./UserModel";
import mongoose, { Document } from "mongoose";

// Instagram

export interface IPostIG {
    url: string;
    isCarousel: boolean;
    caption: string;
    userTags: string[];
    accessToken: string;
    mediaType: string;
    shareToFeed: boolean;
    collaborators: string[];
    coverUrl: string;
    audioName: string;
    locationId: string
    user: mongoose.Types.ObjectId;
}

const postImageSchema = new Schema<IPostIG>({
    url: { type: String, required: true },
    isCarousel: { type: Boolean, required: true, default: false },
    caption: { type: String, default: "" },
    userTags: { type: [String], default: [] },
    accessToken: { type: String, required: true },
    locationId: { type: String, default: "" },
    user: { type: Schema.Types.ObjectId, ref: User, required: true }
});

export const PostImageIG = model<IPostIG>('PostImageIG', postImageSchema);

const postReelSchema = new Schema<IPostIG>({
    mediaType: "REELS",
    url: { type: String, required: true },
    caption: { type: String, default: "" },
    userTags: { type: [String], default: [] },
    accessToken: { type: String, required: true },
    shareToFeed: { type: Boolean, required: true },
    collaborators: { type: [String], default: [] },
    coverUrl: { type: String, required: true },
    audioName: { type: String, default: null },
    locationId: { type: String, default: "" },
    user: { type: Schema.Types.ObjectId, ref: User, required: true }
});

export const PostReelIG = model<IPostIG>('PostReelIG', postReelSchema);
