import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import { generateChatCompletion } from "../controllers/chat-controller.js";
import { sendChatsToUser } from "../controllers/chat-controller.js";
import { deleteChats } from "../controllers/chat-controller.js";

const chatRoutes = Router();
// protected api only authenticated user can use

chatRoutes.post("/new",validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);



export default chatRoutes;