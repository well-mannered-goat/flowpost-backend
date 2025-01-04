import { Router } from "express";
import { registerUser, loginUser, getUser, updateUser, deleteUser } from "../controllers/AuthControllers";
import authenticateToken from "../middlewares/AuthenticateToken";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticateToken, getUser);
router.put("/user", authenticateToken, updateUser);
router.delete("/user", authenticateToken, deleteUser);

export default router;
