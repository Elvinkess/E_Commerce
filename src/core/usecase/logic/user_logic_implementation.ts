import { User, UserRole } from "../../domain/entity/user";
import { IUserDb } from "../interface/data_access/user_db";
import { IUserLogic } from "../interface/logic/user_logic";
import { createHmac } from "crypto";
import { Buffer } from "buffer";
import { SignInUserDTO } from "../../domain/dto/requests/user_requests";
import jwt from 'jsonwebtoken'
import { SignInUserResponse } from "../../domain/dto/responses/user_response";
import { JwtPayload } from "../../domain/dto/requests/jwtpayload";
import { BadRequestError } from "../utilities/Errors/bad_request";
import { NotFoundError } from "../utilities/Errors/not_found_request";


export class UserLogic implements IUserLogic{
   
    constructor(private userDb: IUserDb) {
        
        
    }
    createUser = async (user: User): Promise<User> => {
        // check if user exists in db
        let userExists = await this.userDb.get({email: user.email}) //repository pattern
        console.log({userExists, mail: user.email})
        if(userExists.length){
            // if user exists throw error
            throw new BadRequestError("User with email exists")
        }
        // hash password
        let hashedPassword = this.hashPassword(user.password);
        user.password =  hashedPassword;
        return await this.userDb.save(user);
        // save  user 
    }

    public hashPassword = (password: string) :  string => {
        let key = process.env.HASH_PASSWORD_KEY!
        let hmac = createHmac('sha512', key);
        return hmac.update(password).digest('hex').toString();
    }

    encryptDataUsingJWT = async (data:JwtPayload, durationInSeconds: number): Promise<string> => {

        let secret = process.env.JWT_SECRET!
        let encrypted = jwt.sign(
            data
          , secret, { expiresIn: durationInSeconds});
          console.log( jwt.verify(encrypted, secret) )          
          return encrypted;
    }

     decodedjwt = (token:string):JwtPayload =>{
        let secret = process.env.JWT_SECRET!
        return jwt.verify(token, secret) as JwtPayload
    }


    signInUser = async (signInDTO: SignInUserDTO): Promise<SignInUserResponse> => {
        // get user with email
        let user = await this.userDb.getOne({email: signInDTO.email});
        if(!user){
            throw new NotFoundError("User with email does not exist");
        }

        
        // hash user password
        let currentPasswordHash = this.hashPassword(signInDTO.password);

        if(user.password !== currentPasswordHash){
            throw new BadRequestError("Invalid password")
        }

        // user is signed in // 
        let dataToEncrypt : JwtPayload = {
            username: user.username,
            email: user.email,
            id: user.id,
            role:user.role as UserRole
        }
        // encrypt email, role, using JWT
        let expirationInSeconds = 60 * 3600
        console.log(dataToEncrypt)
        let encryptedData = await this.encryptDataUsingJWT(dataToEncrypt, expirationInSeconds)
       
        
        return {
            id:user.id,
            email: user.email,
            username: user.username,
            role:user.role,
            token: encryptedData,
            expirationInSeconds 
        }
      
    }

}