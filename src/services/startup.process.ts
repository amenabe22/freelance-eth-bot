import FormData from "form-data";
import axios from "axios"
import { UPLOAD_ENDPOINT } from "../constants";
import request from "request"

// export const registerStartup = async (formDataObj: FormData) => {
//     const formData = new FormData();
//     const res = await axios.post(UPLOAD_ENDPOINT, formDataObj, {
//         headers: formData.getHeaders()
//     })
//     return res
// }


export const registerStartup = (formData: any, cb: any) => {
    request.post({ url: UPLOAD_ENDPOINT, formData: formData }, cb);
}