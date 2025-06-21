import axios from "./Axios";
 const GetAllMessage = async(id:string)=>{
    return axios.get('/message',{
        params:{chatId:id}
    })
}
const SendMessage = async(content:string,chatId:string)=>{
    return axios.post('/message',{
        content,chatId
    })
}
export {GetAllMessage,SendMessage}