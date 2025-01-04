import { Router } from "express";
import { createPostImageIG } from "../controllers/PostControllers";
import authenticateToken from "../middlewares/AuthenticateToken";
import uploadToCloud from "../middlewares/cloudStorage";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/ig/image", authenticateToken, upload.single("image"), uploadToCloud, createPostImageIG);

export default router;