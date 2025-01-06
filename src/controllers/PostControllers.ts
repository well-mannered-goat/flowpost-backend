import { Request, Response } from "express";
import { PostImageIG, PostReelIG, PostCarouselIG } from "../models/PostModels";
import { User } from "../models/UserModel";
import { CustomRequest } from "../middlewares/AuthenticateToken";
import axios, { AxiosResponse } from "axios";
import { decryptToken } from "../internal/token";

interface APIResponse {
    id: string
}

export const createPostImageIG = async (req: CustomRequest, res: Response) => {
    try {
        const { url, caption, userTags, isCarousel, locationId } = req.body;

        const user = await User.findById(req.user)
        const token = user?.insta_access_token;
        if (!token) {
            res.status(404).json({ message: "Access token not found" });
            return;
        }

        const accessToken = decryptToken(token);

        const userInfoUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`;
        const userInfoRes = await axios.get(userInfoUrl);

        const igAccount = userInfoRes.data.data.find(
            (account: any) => account.access_token === accessToken
        );

        if (!igAccount) {
            res.status(400).json({ message: "Invalid access token or no associated Instagram account." });
            return;
        }

        const igUserId = igAccount.id;

        const newPost = new PostImageIG({
            url,
            caption,
            userTags,
            accessToken,
            user
        });
        await newPost.save();

        const uploadUrl = `https://graph.facebook.com/v21.0/${igUserId}/media?image_url=${url}&is_carousel_item=${isCarousel}&caption=${caption}&location_id=${locationId}&user_tags=${userTags}&access_token=${accessToken}`;
        const uploadRes = await axios.post(uploadUrl);

        const containerId = uploadRes.data.id;

        const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish?creation_id=${containerId}&access_token=${accessToken}`;
        const publishRes = await axios.post(publishUrl);

        const mediaId = publishRes.data.id;
        if (!mediaId) {
            res.status(400).json({ message: "Error publishing post." });
            return;
        }

        res.status(201).json({ message: "Post created successfully", mediaId });
    }
    catch (error) {
        console.error("Error creating Instagram post:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const createPostReelIG = async (req: CustomRequest, res: Response) => {
    try {
        const { url, caption, userTags, coverUrl, audioName, shareToFeed, collaborators, locationId } = req.body;

        const user = await User.findById(req.user);
        const token = user?.insta_access_token;

        if (!token) {
            res.status(404).json({ message: "Access token not found" });
            return;
        }

        const accessToken = decryptToken(token);
        const userInfoUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`;
        const userInfoRes = await axios.get(userInfoUrl);

        const igAccount = userInfoRes.data.data.find(
            (account: any) => account.access_token === accessToken
        );

        if (!igAccount) {
            res.status(400).json({ message: "Invalid access token or no associated Instagram account." });
            return;
        }

        const igUserId = igAccount.id;
        const newPost = new PostReelIG({
            url,
            caption,
            userTags,
            accessToken,
            shareToFeed,
            collaborators,
            coverUrl,
            audioName,
            locationId,
            user
        });
        await newPost.save();

        const uploadurl = `POST https://graph.facebook.com/v21.0/${igUserId}/media?media_type=REELS&video_url=${url}&caption=${caption}&share_to_feed=${shareToFeed}&collaborators=${collaborators}&cover_url=${coverUrl}&audio_name=${audioName}&user_tags=${userTags}&location_id=${locationId}&access_token=${accessToken}`;
        const uploadRes = await axios.post(uploadurl);

        const containerId = uploadRes.data.id;

        const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish?creation_id=${containerId}&access_token=${accessToken}`;
        const publishRes = await axios.post(publishUrl);

        const mediaId = publishRes.data.id;
        if (!mediaId) {
            res.status(400).json({ message: "Error publishing post." });
            return;
        }

        res.status(201).json({ message: "Reel created successfully", mediaId });
    }
    catch (error) {
        console.error("Error creating Instagram reel:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const postCarouselImage = async (req: CustomRequest, res: Response) => {
    try {
        const { url, caption, userTags, locationId, shareToFeed, collaborators } = req.body;
        if (url.length > 10 || url.length < 2) {
            res.status(400).json({ message: "Please provide a minimum of 2 and a maximum of 10 images" });
            return;
        }
        const user = await User.findById(req.user);

        const token = user?.insta_access_token;
        if (!token) {
            res.status(404).json({ message: "Access token not found" });
            return;
        }

        const accessToken = decryptToken(token);

        const userInfoUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`;
        const userInfoRes = await axios.get(userInfoUrl);

        const igAccount = userInfoRes.data.data.find(
            (account: any) => account.access_token === accessToken
        );

        if (!igAccount) {
            res.status(400).json({ message: "Invalid access token or no associated Instagram account." });
            return;
        }

        const igUserId = igAccount.id;
        const newPost = new PostCarouselIG({
            url,
            caption,
            accessToken,
            shareToFeed,
            collaborators,
            locationId,
            user
        });
        await newPost.save();

        const childMediaIds: string[] = [];
        let i = 0;

        for (const imageUrl of url) {
            const isCarousel = true;
            const uploadUrl = `https://graph.facebook.com/v21.0/${igUserId}/media?image_url=${imageUrl}&is_carousel_item=${isCarousel}&caption=${caption}&location_id=${locationId}&user_tags=${userTags[i]}&access_token=${accessToken}`;
            const uploadRes = await axios.post(uploadUrl);

            const containerId = uploadRes.data.id;
            childMediaIds.push(containerId);
            i++;
        }

        const carouselUploadUrl = `https://graph.facebook.com/v21.0/${igUserId}/media?media_type=CAROUSEL&caption=${caption}&share_to_feed=${shareToFeed}&collaborators=${collaborators}&location_id=${locationId}&children=${childMediaIds}&access_token=${accessToken}`
        const uploadRes = await axios.post(carouselUploadUrl);

        const containerId = uploadRes.data.id;

        const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish?creation_id=${containerId}&access_token=${accessToken}`;
        const publishRes = await axios.post(publishUrl);

        const mediaId = publishRes.data.id;
        if (!mediaId) {
            res.status(400).json({ message: "Error publishing post." });
            return;
        }

        res.status(201).json({ message: "Carousel created successfully", mediaId });
    }
    catch (error) {
        console.error("Error creating Instagram carousel:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}
