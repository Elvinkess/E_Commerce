import { Request,Response,NextFunction } from "express";
import { UserRole } from "../../core/domain/entity/user";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { Categories } from "../../core/domain/entity/categories";


 

 interface AuthRequest extends Request {
  user?: {email: string; username: string; role: UserRole; id: number} ;
}


export  function authorizeRole  (roles: UserRole[]){
    return (req: AuthRequest, res: Response, next: NextFunction):void => {
      
      console.log(req.user)
      if (!req.user || !roles.includes(req?.user?.role ?? UserRole.EDITOR  )) {

         //onsole.log("Full user object from request:", req.user);
        //console.log("User role from request:", req.user?.role as UserRole);
        
        console.log("Allowed roles:", roles);
         res.status(403).json({ message: "Forbidden: You don't have the required role" });
         return
      }
      next();
    };
  };

  export class AuthMiddleware{
    constructor(public userlogic:IUserLogic){}

    authorizeRole  (roles: UserRole[]){
      return (req: AuthRequest, res: Response, next: NextFunction):void => {
        
        console.log(req.user)
        if (!req.user || !roles.includes(req?.user?.role  )) {
  
           //onsole.log("Full user object from request:", req.user);
          //console.log("User role from request:", req.user?.role as UserRole);
          
          console.log("Allowed roles:", roles);
           res.status(403).json({ message: "Forbidden: You don't have the required role" });
           return
        }
        next();
      }
    }
     authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) :Promise<any> => {
      const token = req.cookies?.token;
      console.log(token,"--token---")
    
      if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
      }
    
      try {
        const decoded = this.userlogic.decodedjwt(token);
        req.user = decoded;
         console.log(req.user)
        next();
      } catch (err) {
        res.status(403).json({ message: "Invalid token" });
      }
    };
    

  }