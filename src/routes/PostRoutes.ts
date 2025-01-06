import { Router } from "express";
import { createPostImageIG, createPostReelIG } from "../controllers/PostControllers";
import { storeAccessToken } from "../controllers/TokenController";
import authenticateToken from "../middlewares/AuthenticateToken";
import uploadToCloud from "../middlewares/cloudStorage";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/ig/image", authenticateToken, upload.single("image"), uploadToCloud, createPostImageIG);
router.post("/ig/reel", authenticateToken, upload.single("video"), uploadToCloud, createPostReelIG);
router.post("/token", authenticateToken, storeAccessToken);

export default router;
