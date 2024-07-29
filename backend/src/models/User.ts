import { randomUUID } from "crypto";
import mongoose, { mongo } from "mongoose";

const chatsSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    role: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    chats: [chatsSchema]
});

export default mongoose.model("User", userSchema);