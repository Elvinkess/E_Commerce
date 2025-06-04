import UploadFile from "../../../domain/entity/shared/uploadfile";

export default interface IFileService {
    uploadFile( file: UploadFile, folder?: string | null , resourceType?: string , fileName?: string): Promise<UploadFile | null>;
    uploadMultipleFiles(files: UploadFile[]): Promise<UploadFile[]>
    deleteFile(publicId: string): Promise<void>;
    deletMultipleFiles(publicIds: string[]): Promise<void>;
    deleteFileFromDisk(url: string): Promise<void>
}

export const IIFileService = 'IFileService'