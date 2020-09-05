import axios from 'axios';
import { getToken } from "./auth";

const token = getToken();

let api = axios.create({
  baseURL: 'http://104.131.13.240:3333',
});

if(token != null)
api.defaults.headers.Authorization = `Bearer ${token}`;

 //baseURL: 'http://localhost:3333', 

//api.defaults.headers.Authorization = `Bearer ${token}`;
/*api.interceptors.request.use(async config => {
   
   if (token) {
     config.headers.authorization = `Bearer ${token}`;
   }
   return config;
 });
*/

export default api;