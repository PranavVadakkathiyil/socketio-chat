import axios from 'axios'
 const AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});
export default AxiosInstance