import axios from "./Axios";
 const GetAllChats = async()=>{
    return axios.get('/chat')
}
const createChats = async(id:string)=>{
    return axios.post('/chat',{receiverId:id})
}
export {GetAllChats,createChats}