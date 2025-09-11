export class SignInUserResponse {
    id!:number
    email!: string;
    username!: string;
    token!: string;
    role!:string
    expirationInSeconds!: number
}