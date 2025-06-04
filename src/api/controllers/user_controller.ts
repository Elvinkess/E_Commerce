import { NextFunction, Request, Response } from "express";
import { User } from "../../core/domain/entity/user";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { SignInUserDTO } from "../../core/domain/dto/requests/user_requests";

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

    signInUser = async (req : Request<{}, {}, SignInUserDTO>, res: Response, next: NextFunction) => {
        try{
            let signInUserResponse = await this.userLogic.signInUser(req.body);
            res.json(signInUserResponse)
        } catch(ex){
            res.json({error: (ex as Error).message})
        }
    }
}