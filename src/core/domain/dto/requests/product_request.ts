import UploadFile from "../../entity/shared/uploadfile";

export class CreateProduct{
    public name!:string;
    public price!:number;
    public image  : UploadFile | null = null
    public quantity_available!: number;
    public category_name!:string
    public category_id?:number;

}