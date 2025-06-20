import axios from "./Axios";
 const GetAllChats = async()=>{
    return axios.get('/chat')
}
const createChats = async(id:string)=>{
    return axios.post('/chat',{receiverId:id})
}
const createGroup = (users:string[],groupname:string)=>{
    return axios.post('/chat/group',{
        users:JSON.stringify(users),
        groupname
    })
}
export {GetAllChats,createChats,createGroup}