import { UserRole } from "../../entity/user";

export interface JwtPayload {
    email:string
    username: string;
    role: UserRole;
    id: number;
    
  }