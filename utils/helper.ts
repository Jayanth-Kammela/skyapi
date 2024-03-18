import { CustomError, ErrorResponse, SuccessResponse } from "./types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from "../models/user.model";

const generateTokens = async (_id: string) => {
    const secret = process.env.SECERT as string;

    const refreshSecret = process.env.REFRESH_SECERT as string;
    try {
        if (!secret) {
            throw new Error('Please provide SECRET key');
        }
        const payload = { _id: _id };
        const accessToken = jwt.sign(payload, secret, {
            expiresIn: 5 * 60 * 1000, //5min
        });
        const refreshToken = jwt.sign(payload, refreshSecret, {
            expiresIn: "30d",
        });

        const user = await userModel.findOneAndUpdate(
            { _id: _id },
            { token: refreshToken }
        );
        if (!user) {
            const error: CustomError = { message: 'No such user found' };
            throw new Error(JSON.stringify(error));
        }
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);

    }
};

const verifyToken = async (refreshToken: string,) => {
    const refreshSecret = process.env.REFRESH_SECERT as string;
    try {
        const user = await userModel.find({ token: refreshToken });
        console.log(user + "service");

        if (!user) {
            const error: CustomError = { message: 'Invalid refresh token' };
            throw new Error(JSON.stringify(error));
        }

        const { _id }: any = jwt.verify(refreshToken, refreshSecret);
        return _id;
    } catch (err: any) {
        throw Error(err);
    }
};

const comparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(enteredPassword, hashedPassword);
};

const success = (statusCode: number, message: string, result: any): SuccessResponse => {
    return {
        status: true,
        statusCode,
        message,
        result,
    };
};

const error = (statusCode: number, message: string): ErrorResponse => {
    return {
        status: false,
        statusCode,
        message,
    };
};

export { generateTokens, verifyToken, comparePassword, success, error };