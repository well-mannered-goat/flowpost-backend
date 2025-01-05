import { Request, Response } from "express";
import {User} from "../models/UserModel";
import { encryptToken } from "../internal/token";

export const storeAccessToken = async (req: Request, res: Response) => {
  try {
    const { userId, instagramToken, youtubeToken } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (instagramToken) {
      user.insta_access_token = encryptToken(instagramToken);
    }

    if (youtubeToken) {
      user.yt_access_token = encryptToken(youtubeToken);
    }

    await user.save();

    res.status(200).json({ message: "Access tokens encrypted and stored successfully" });
  } catch (error) {
    console.error("Error storing access tokens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
