import { Request, Response } from "express";
import { PostImageIG, PostReelIG } from "../models/PostModels";
import { User } from "../models/UserModel";
import { CustomRequest } from "../middlewares/AuthenticateToken";
import axios, { AxiosResponse } from "axios";

interface APIResponse {
    id: string
}

// instagram

export const createPostImageIG = async (req: CustomRequest, res: Response) => {
    try {
        const { url, caption, userTags, isCarousel, accessToken, locationId } = req.body;
        const user = await User.findById(req.user);

        const newPost = new PostImageIG({
            url,
            caption,
            userTags,
            isCarousel,
            accessToken,
            user
        });
        await newPost.save();

        const uploadUrl = `https://graph.facebook.com/v21.0/${user?.username}/media?image_url=${url}&is_carousel_item=${isCarousel}&caption=${caption}&location_id=${locationId}&user_tags=${userTags}&product_tags=<ARRAY_OF_PRODUCTS_FOR_TAGGING>&access_token=${accessToken}`
        const uploadRes = await axios.post(uploadUrl) as APIResponse;

        const containerId = uploadRes.id;
        const publishUrl = `https://graph.facebook.com/v21.0/${user?.username}/media_publish?creation_id=${containerId}`;

        const publishRes = await axios.post(publishUrl) as APIResponse;
        const mediaId = publishRes.id;

        if (!mediaId) {
            res.status(400).send("Error creating post")
            return
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}
