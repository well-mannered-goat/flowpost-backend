import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloud = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file && !req.files)
        {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path)
            req.body.url = result.secure_url;
        }
        else {
            const uploadedImagesUrl: string[] = [];
            const files = req.files as Express.Multer.File[];

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path);
                fs.unlinkSync(file.path)
                uploadedImagesUrl.push(result.secure_url);
            }
            req.body.url = uploadedImagesUrl;
        }

        next();
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

export default uploadToCloud;
