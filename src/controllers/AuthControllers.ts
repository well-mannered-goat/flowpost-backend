import { User } from "../models/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomRequest } from "../middlewares/AuthenticateToken";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
    {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
    } 
  catch (error) {
    res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user)
        {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword)
        {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

        res.status(200).json({
            message: "User logged in successfully",
            token
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        console.log(error)
    }
}

export const getUser = async (req: CustomRequest, res: Response) => {
    try {
        const user = await User.findById(req.user);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUser = async (req: CustomRequest, res: Response) => {
    try {
        const { username, email } = req.body;
        await User.findByIdAndUpdate(req.user, { username, email });
        res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req: CustomRequest, res: Response) => {
    try {
        await User.findByIdAndDelete(req.user);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
