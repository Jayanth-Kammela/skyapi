import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import userModel from "../models/user.model";
import { comparePassword, error, success } from "../utils/helper";
import { generateTokens, verifyToken } from "../utils/helper";
import mongoose from "mongoose";

const userSignUp = async (req: Request, res: Response) => {
    const { fullName, email, password, gender } = req.body;

    if (!fullName || !email || !password || !gender) {
        return res.status(400).send(error(400, 'All fields fullName, email, password, gender are required'));
    }

    try {
        const checkUser = await userModel.findOne({ email });
        if (checkUser) {
            return res.status(400).send(error(400, 'User already exists'));
        }

        const salt = 10;
        const hash = await bcrypt.hash(password, salt);
        const user = await userModel.create({ fullName, email, gender, password: hash });
        const token = await generateTokens(user._id);

        return res.status(201).send(success(201, "User registered successfully", { fullName, email, token: token }));
    } catch (err: any) {
        return res.status(400).send(error(400, err.message));
    }
};

const userSignIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).send(error(400, 'Email & Password is required'));
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send(error(401, 'User not found'));
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send(error(401, 'Invalid password'));
        }

        const tokens = await generateTokens(user._id);

        return res.status(200).send(success(200, "User signed in successfully", { fullName: user.fullName, email: user.email, token: tokens }));
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(error(500, err.message));
    }
};

const userDetails = async (req: Request, res: Response) => {
    const { user } = req.body;


    try {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(401).send(error(401, "Provide a valid user Id"));
        }

        const desiredFields = "fullName profilePic email gender";
        const details = await await userModel.find({ _id: user }).select(desiredFields);

        if (!details) {
            return res.status(400).send(error(400, "No such user found"));
        }

        if (!user) {
            return res.status(400).send(error(400, "No such user found"));
        }
        return res.status(200).send(success(200, "User details", details))
    } catch (err: any) {
        return res.status(200).send(error(200, err.message))
    }

}

const updateUser = async (req: Request, res: Response) => {
    const { fullName, email, password, gender,user }= req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(user._id)) {
            return res.status(400).send(error(400, "Provide a valid user Id"))
        }
        const userData = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: req.body }, { new: true });


        if (!userData) {
            return res.status(400).send(error(400, "No such user found"));
        }

        return res.status(200).send(success(200, "User updated successfull", { fullName, email, password, gender }))
    }
    catch (err: any) {
        return res.status(500).send(error(500, err.message))
    }
}

const refreshUserToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const refreshSecret = process.env.SECERT as string
        const id = await verifyToken(refreshToken);
        const payload = { _id: id };
        const accessToken = await jwt.sign(payload, refreshSecret, {
            expiresIn:  5 * 60 * 1000, //5min,
        });
        return res.status(200).send(success(200, "Access token created successfully", { accessToken }))
    } catch (err: any) {
        return res.status(404).send(error(404, err.message))
    }
};

module.exports = { userSignUp, userSignIn, userDetails, updateUser, refreshUserToken }
