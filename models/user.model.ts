import mongoose from 'mongoose';
import { UserType } from '../utils/types';

const userModel=new mongoose.Schema<UserType>({
    fullName: {
        type: String,
        trim: true,
        required: [true, 'Please enter a fullname'],
        match: /^[\p{L}].*$/u
    },
    profilePic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    gender: {
        type: String,
        enum: ['none', 'male', 'female', 'others'],
        required: [true, 'Please select gender'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please add a E-mail'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid E-mail'
        ]
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, 'Password must have at least six(6) characters'],
        required: [true, 'Please enter password']
    },
    token: {
        type: String,
    }
})

export default mongoose.model<UserType>('UserSky',userModel)