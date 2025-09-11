import UploadFile from "../../entity/shared/uploadfile";

export interface updateProductReq{
    id:number
    name?:string;
    price?:number;
    category_id?:number;
    image ? : UploadFile
     quantity_available?: number;
}