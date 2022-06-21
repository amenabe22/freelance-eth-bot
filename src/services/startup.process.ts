import FormData from "form-data";
import axios from "axios"
import { UPLOAD_ENDPOINT } from "../constants";

export const registerStartup = async (formDataObj: FormData) => {
    const formData = new FormData();
    const res = await axios.post(UPLOAD_ENDPOINT, formDataObj, {
        headers: formData.getHeaders()
    })
    return res
}
  