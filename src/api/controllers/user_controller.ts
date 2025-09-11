import { NextFunction, Request, Response } from "express";
import { User } from "../../core/domain/entity/user";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { SignInUserDTO } from "../../core/domain/dto/requests/user_requests";
import { UserLogic } from "../../core/usecase/logic/user_logic_implementation";

// uses the usecase to make appropriate calls from the client (express)
export class UserController {
    
    constructor(private userLogic: IUserLogic) {
        
    }
    createUser = async (req : Request<{}, {}, User>, res: Response, next: NextFunction) => {
        try{
            let user = await this.userLogic.createUser(req.body);
            res.json(user)
        } catch(ex){
            res.json({error: (ex as Error).message})
        }
    }

    signInUser = async (req: Request<{}, {}, SignInUserDTO>, res: Response, next: NextFunction) => {
        try {
            let signInUserResponse = await this.userLogic.signInUser(req.body);
    
            const { token, email, username,id } = signInUserResponse;
    
            res.cookie("token", token, {
                httpOnly: true,   // prevents JS access
                secure: process.env.NODE_ENV === "production", // set true if using HTTPS
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
                maxAge: 60 * 60 * 1000, // 1 hour
            });
    
             res.json({
                message: "Login successful",
                user: { email, username,id },
            });
    
        } catch (ex) {
            res.status(400).json({ error: (ex as Error).message });
        }
    };
    decodeUser = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.token;
            if (!token) {res.status(401).json({ message: "Unauthorized" });return}
            

            const payload =  this.userLogic.decodedjwt(token)
            res.json({ user: payload });
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
    
}