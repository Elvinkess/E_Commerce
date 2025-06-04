import { MyBaseEntity } from "./shared/my_base_entity";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
    EDITOR="editor"
  }

export class User extends MyBaseEntity{
    
    username:string;
    email:string
    password:string;
    role:string
    constructor(_username:string,_email:string,_password:string,_role:string){
        let _id = 0
        super(_id);
        this.username = _username
        this.email = _email
        this.password = _password;
        this.role=_role
    }

}