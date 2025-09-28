import { NextFunction, Request, Response } from "express";
import { User } from "../../core/domain/entity/user";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { SignInUserDTO } from "../../core/domain/dto/requests/user_requests";
import { HttpErrors } from "../../core/domain/entity/shared/error";


export class UserController {
    
    constructor(private userLogic: IUserLogic) {
        
    }
    createUser = async (req : Request<{}, {}, User>, res: Response, next: NextFunction) => {
        try{
            let user = await this.userLogic.createUser(req.body);
            res.json(user)
        } catch(err){
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
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
    
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.status(400).json({ error: (err as Error).message });
        }
    };
    decodeUser = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.token;
            if (!token) {res.status(401).json({ message: "Unauthorized" });return}
            

            const payload =  this.userLogic.decodedjwt(token)
            res.json({ user: payload });
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.status(400).json({ error: (err as Error).message });
        }
    };
    
}