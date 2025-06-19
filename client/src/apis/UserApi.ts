import axios from "./Axios";
 const registerUser = async(formData:FormData)=>{
    return axios.post('/user/register',formData)
}
 const loginUser = async(data:{phone:string,password:string})=>{
    return axios.post('/user/login',data)
}
const Logout = async () => {
    return axios.post('/user/logout')
} 

const getCurrentUserInfo = async () => {
    return axios.get('/user/getuser')
} 
const getUserInfo = async (search:string) => {
    return axios.get('/user/search',{
        params:{search}
    })
} 

export {registerUser,loginUser,Logout,getCurrentUserInfo,getUserInfo}