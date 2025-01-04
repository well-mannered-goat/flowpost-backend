import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
    user?: any;
}

export interface DecodedToken {
    _id: string;
    iat: number;
    exp: number;
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token)
        {
            res.status(401).json({ message: "Access denied" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded._id;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default authenticateToken;
