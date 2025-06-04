export class RandomUtility{
 static generateRandomString(size:number){
    let chars = "qwertyuiopasdfghjklzxcvbnm"
    let response = ""
    for(let i=0;i<size;i++){
     response += chars[  Math.floor(Math.random() * chars.length)]
    }
    return response
 }
}