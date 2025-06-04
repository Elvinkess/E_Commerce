import UploadFile from "../../entity/shared/uploadfile";

export class CreateProduct{
    public name!:string;
    public price!:number;
    public category_id!:number;
    public image  : UploadFile | null = null
    public quantity_available!: number;
}