// All application code will be processed here.
import express from "express";
import { config } from "dotenv";
import pkg from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const morgan = pkg;
config(); // to connect database from dotenv files
const app = express();
//middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // this is to allow requenst sending from this server to backend.
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); //cookie parser is used to send cookies from backend to frontend.
//remove it in production.
app.use(morgan("dev")); // to log all the details related to request.
app.use("/api/v1", appRouter); //Once we move on to this endpoint /api/v1 then it will transferred to appRouter
export default app;
//# sourceMappingURL=app.js.map