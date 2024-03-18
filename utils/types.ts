import mongoose, { Document } from "mongoose";

export interface UserType extends Document{
    fullName:string;
    profilePic:string;
    gender:string;
    email:string;
    password:string;
    token:string;
}

export interface TaskType extends Document{
    taskName:string;
    taskDescription:string;
    userId:mongoose.Types.ObjectId
}

export interface CustomError {
    message: string;
}

export interface SuccessResponse {
    status: boolean;
    statusCode: number;
    message: string;
    result: any;
}

export interface ErrorResponse {
    status: boolean;
    statusCode: number;
    message: string;
}