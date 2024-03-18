import mongoose from 'mongoose';
import { TaskType } from '../utils/types';

const taskModel = new mongoose.Schema<TaskType>({
    taskName: {
        type: String,
        trim: true,
        required: [true, 'Please enter a task name'],
    },
    taskDescription: {
        type: String,
        required: [true, 'Please enter task description'],
    },
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        trim: true,
    },

})

export default mongoose.model<TaskType>('TaskSky', taskModel)