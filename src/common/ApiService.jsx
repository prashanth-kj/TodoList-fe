import axios from "axios";

 let AxiosService = axios.create({
    
    baseURL:`${import.meta.env.VITE_API_URL}`,
    headers:{
        "Content-Type":"application/json"
    }
 })

 export default AxiosService