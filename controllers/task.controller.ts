import { Request, Response } from "express";
import { error, success } from "../utils/helper";
import taskModel from "../models/task.model";
import mongoose from "mongoose";

const postTasks = async (req: Request, res: Response) => {
    const { taskName, taskDescription, user } = req.body

    try {
        const task = await taskModel.create({ taskName, taskDescription, userId: user });
        console.log(task);
        
        return res.status(201).send(success(201, "Task created successfully", task));
    } catch (err: any) {
        return res.status(500).send(error(500, err.message));
    }
}

const getTasks = async (req: Request, res: Response) => {
    const { user } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).send(error(400, "Provide a valid user Id"))
        }

        const task = await taskModel.find({userId:user})
        return res.status(200).send(success(200, "Retrive tasks successfully", task));
    } catch (err: any) {
        return res.status(500).send(error(500, err.message));
    }
}

const updateTasks = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const task = await taskModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true });
        return res.status(200).send(success(200, "Task updated successfully", task));
    } catch (err: any) {
        return res.status(500).send(error(500, err.message));
    }
}

const deleteTasks = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const task = await taskModel.findByIdAndDelete({ _id: id });
        return res.status(200).send(success(200, "Task deleted successfully", task));
    } catch (err: any) {
        return res.status(500).send(error(500, err.message));
    }
}

module.exports = { postTasks, getTasks,updateTasks,deleteTasks }