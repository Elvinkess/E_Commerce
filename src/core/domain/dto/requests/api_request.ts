import { contentType } from "../../enums/content_type"

export class ApiRequest {
    url!:string
    webhook_url?: string;
    header?:{
        Authorization?:string
        contentType?: contentType,
        [key:string]:string| undefined

    }
    body?:object

}