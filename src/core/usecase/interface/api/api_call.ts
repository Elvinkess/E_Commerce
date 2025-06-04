import { ApiRequest } from "../../../domain/dto/requests/api_request"

export interface IApiResponse<T>{
    status:number
    data:T | null
    ok:boolean
    message?: string
}


export interface IApi{
   
    get<T>(req:ApiRequest):Promise<IApiResponse<T> >
    post<T>(req:ApiRequest):Promise<IApiResponse<T> >
    put<T>(req:ApiRequest):Promise<IApiResponse<T> >
    patch<T>(req:ApiRequest):Promise<IApiResponse<T> >
    delete<T>(req:ApiRequest):Promise<IApiResponse<T> >
}