import axios, { Axios, AxiosError } from  "axios"
import { ApiRequest } from "../../domain/dto/requests/api_request"
import { IApi, IApiResponse } from "../../usecase/interface/api/api_call"


export class Api implements IApi{
   async  get<T>(req: ApiRequest): Promise<IApiResponse<T> > {
    try {
        
       let response = await axios.get(req.url,{headers:{...req.header}})
       return { 
        status:response.status,
        data:response.data,
        ok:true,
        message:response.statusText
       }
     
    } catch (e) {
       let error = e as AxiosError
       if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { 
            status:error.response.status,
            data:error.response.data as T,
            ok:false,
            message:error.message
           }
       
      } else if (error.request) {
        console.log(error.request);

        return { 
            status:error.status ?? 500,
            data:null,
            ok:false,
            message:error.message
           }
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
      } else {
        // Something happened in setting up the request that triggered an Error
        return { 
            status:error.status ?? 500,
            data:null,
            ok:false,
            message:error.message
           }
      }
   
    }
    }
    async post<T>(req: ApiRequest): Promise<IApiResponse<T>> {
        try {


            let response = await axios.post(req.url,req.body,{headers:{...req.header,"Content-Type":req.header?.contentType?? "application/json"}})
            return { 
                status:response.status,
                data:response.data,
                ok:true,
                message:response.statusText
               }
             
            } catch (e) {
               let error = e as AxiosError
               if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return { 
                    status:error.response.status,
                    data:error.response.data as T,
                    ok:false,
                    message:error.message
                   }
               
              } else if (error.request) {
                return { 
                    status:error.status ?? 500,
                    data:null,
                    ok:false,
                    message:error.message
                   }
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
              } else {
                // Something happened in setting up the request that triggered an Error
                return { 
                    status:error.status ?? 500,
                    data:null,
                    ok:false,
                    message:error.message
                   }
              }
           
            }
        
    }
    put<T>(req: ApiRequest): Promise<IApiResponse<T>> {
        throw new Error("Method not implemented.");
    }
    patch<T>(req: ApiRequest): Promise<IApiResponse<T>>  {
        throw new Error("Method not implemented.");
    }
    delete<T>(req: ApiRequest): Promise<IApiResponse<T>>  {
        throw new Error("Method not implemented.");
    }
    
}