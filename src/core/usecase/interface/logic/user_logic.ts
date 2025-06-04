import { JwtPayload } from "../../../domain/dto/requests/jwtpayload";
import { SignInUserDTO } from "../../../domain/dto/requests/user_requests";
import { SignInUserResponse } from "../../../domain/dto/responses/user_response";
import { User } from "../../../domain/entity/user";

export interface IUserLogic {
    createUser(user: User) : Promise<User>
    signInUser (signInDTO: SignInUserDTO): Promise<SignInUserResponse>
    decodedjwt  (token:string):JwtPayload 
}