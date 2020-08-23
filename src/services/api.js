import axios from 'axios';
import { getToken } from "./auth";

let api = axios.create({
   baseURL: 'http://localhost:3333', 
});


//api.defaults.headers.Authorization = `Bearer ${token}`;
/*api.interceptors.request.use(async config => {
   
   if (token) {
     config.headers.authorization = `Bearer ${token}`;
   }
   return config;
 });
*/

export default api;