import { model, Schema } from "mongoose";

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

}

const postImageSchema = new Schema<IPostIG>({
    url: { type: String, required: true },
    isCarousel: { type: Boolean, required: true },
    caption: { type: String, default: "" },
    userTags: { type: [String], default: [] },
    accessToken: { type: String, required: true }
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
    audioName: { type: String, default: null }
});

export const PostReelIG = model<IPostIG>('PostReelIG', postReelSchema);
