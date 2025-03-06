import express,{Request,Response} from "express";
import { AuthController } from "@controllers/authController";

const AuthRoute = express.Router();

AuthRoute.post("/register",async (req:Request,res:Response)=>{await AuthController.registerUser(req,res)});
AuthRoute.post("/login", async (req:Request,res:Response)=>{AuthController.loginUser(req,res)});

export default AuthRoute;
