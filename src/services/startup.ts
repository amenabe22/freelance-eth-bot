import fs from "fs"
import FormData from "form-data";
import axios from "axios"
import { UPLOAD_ENDPOINT } from "../constants";



export const uploadJobseekerCv = async (jsid: string, path: string) => {
    const formData = new FormData();
    formData.append('job_seeker_id', jsid)
    formData.append('file', fs.createReadStream(path));
    formData.append('folder', 'cv');
    const res = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: formData.getHeaders()
    })
    return res
}
