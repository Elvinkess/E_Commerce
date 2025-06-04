import UploadFile from "../../domain/entity/shared/uploadfile";
import IFileService from "../../usecase/interface/services/file_service";
import { promises as fs } from "fs";
import path from "path";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import { ICloudinaryConfig } from "../config/cloudinary_coonfig";

export default class CloudinaryService implements IFileService{
    public constructor(
         private cloudinaryConfig: ICloudinaryConfig){
        cloudinary.config({
            cloud_name: cloudinaryConfig.CLOUD_NAME,
            api_key: cloudinaryConfig.API_KEY,
            api_secret: cloudinaryConfig.API_SECRET,
            secure: true
          });
        
    }
    uploadFile= async (file: UploadFile ): Promise<UploadFile  | null> => {
        try{
            let kwargs: {[key: string]: string} = {}
          
            if (file.resource_type)
                kwargs.resource_type = file.resource_type
            if (file.folder)
                kwargs.folder = file.folder;
            if (file.public_id)
                kwargs.public_id = file.public_id

            const response: UploadApiResponse = await cloudinary.uploader.upload(file.secure_url, kwargs)

            

            this.deleteFileFromDisk(file.secure_url); // No need to await deleting, just delete

            if (response && response.public_id){
                return new UploadFile(response.resource_type, response.secure_url, response.public_id, response.folder)
            }

            return null;
        }
        catch(ex){
            let errormsg = "";
            try{
               
                this.deleteFileFromDisk(file.secure_url); // No need to await deleting, just delete
                errormsg = JSON.stringify(ex)
            }
            catch(exc){
               
            }
            return null;
        }
    }   

    uploadMultipleFiles = async (files: UploadFile[]): Promise<UploadFile[]> => {
        let allFilesToUpload = files.map(file => this.uploadFile(file));
        
        let results = await Promise.allSettled(allFilesToUpload);
        let uploadedFiles: UploadFile[] = [];
        for (let result of results) {
            if (result.status === "fulfilled" && result.value) {
                uploadedFiles.push(result.value);
            } else if (result.status === "rejected") {
                
            }
        }

        return uploadedFiles;
    }



    deleteFile= async (publicId: string): Promise<void> => {
        
        try{
            if(!publicId){
                return ;
            }
           
            
            const response = await cloudinary.uploader.destroy(publicId)
        }
        catch(ex){
            
        }
    }

    deletMultipleFiles = async (publicIds: string[]): Promise<void> => {
        
        try{
            let allFilesToDelete = publicIds.map(id => this.deleteFile(id))
            await Promise.allSettled(allFilesToDelete)
        }
        catch(ex){
            
            return ;
        }
    };

    
    deleteFileFromDisk = async (url: string) => {
        try{
            let deleted = await fs.unlink(path.join(process.cwd(), url))
            console.log({deleted})
        }
        catch(ex){
            
            console.error(`file in path ${url} not deleted with error: ${ex}`)
        }
    }
}