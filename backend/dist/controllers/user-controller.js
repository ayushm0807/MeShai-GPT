import User from "../models/User.js";
import { hash, compare } from "bcrypt"; // compare is for password hash compare no need to decrypt
import { createToken } from "../utils/token-manager.js";
//get all users dirctly from the database
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        console.log("error");
        return res.status(500).json({ message: "Error", cause: error.message });
    }
};
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body; // destructuring data
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered"); // if user already there.
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // create token and store cookie
        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: "meshai-gpt-backend.onrender.com",
            secure: true,
            signed: true,
            path: "/",
            sameSite: "none",
            partitioned: true,
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token", token, {
            path: "/",
            domain: "meshai-gpt-backend.onrender.com",
            expires,
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "none",
            partitioned: true,
        });
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log("error");
        return res.status(500).json({ message: "Error", cause: error.message });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        // create token and store cookie
        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: "meshai-gpt-backend.onrender.com",
            signed: true,
            path: "/",
            secure: true,
            sameSite: "none",
            partitioned: true,
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token", token, {
            path: "/",
            domain: "meshai-gpt-backend.onrender.com",
            expires,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log("error");
        return res.status(500).json({ message: "Error", cause: error.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const userLogout = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: "meshai-gpt-backend.onrender.com",
            signed: true,
            path: "/",
            secure: true,
            sameSite: "none",
            partitioned: true,
        });
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=user-controller.js.map