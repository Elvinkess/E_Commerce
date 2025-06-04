export default class UploadFile{
    resource_type: string = "";
    secure_url: string = "";
    public_id: string = "";
    folder: string = "";
    name: string = "";

    
     constructor(resource_type: string = "", secure_url: string = "", public_id: string = "", folder: string = ""){
        
        this.resource_type = resource_type;
        this.secure_url = secure_url;
        this.public_id = public_id;
        this.folder = folder;
    
    }
}