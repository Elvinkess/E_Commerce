import {Request} from 'express';
import UploadFile from '../../core/domain/entity/shared/uploadfile';

export default class BaseController {
    protected convertReqFileToUploadFile = (req: Request): UploadFile | null=> {
        try{
            return new UploadFile("", req.file?.path)
        }
        catch(ex){
            console.log(`An exception occured while converting Req file to upload file: ${ex} `)
            return null;
        }
    }

    protected convertReqFilesToUploadFiles = (req: Request, fieldName: string): UploadFile[] => {
        let uploadFiles: UploadFile[] = [];
        try{
            let files = req.files ?? null;
            if(Array.isArray(files)){
                uploadFiles = files.map(file => new UploadFile("",  file.path))
            } else {

                uploadFiles = files?.[fieldName]?.map(file => new UploadFile("",  file.path)) ?? []
            }
            return uploadFiles;
        }
        catch(ex){
            console.log(`An exception occured while converting Req files to upload files: ${ex} `)
            return uploadFiles;
        }
    }
}