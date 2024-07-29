import { Router } from "express";
import { getAllUsers, userLogin, userLogout, verifyUser } from "../controllers/user-controller.js";
import { userSignup } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validator.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
//validators are the middleware that will be executed before the function call.
userRoutes.get("/", getAllUsers); //Go to this controller function. 
userRoutes.post("/signup", validate(signupValidator), userSignup); //post data of user into the db;
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map