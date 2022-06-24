import { REGISTER_USER, COMPANY_HANDOVER } from "../apollo/queries"
import { client } from "../apollo"
import { ENT_CREATE_ENDPT } from "../constants"
import axios from "axios"
import FormData from "form-data";

export const registerNewBotUser = async (variables: any) => {
    const res = await client.mutate({
        mutation: REGISTER_USER,
        variables
    })
    return res
}

export const registerCompany = async (formDataObj: FormData) => {
    const formData = new FormData();
    const res = await axios.post(ENT_CREATE_ENDPT, formDataObj, {
        headers: formData.getHeaders()
    })
    return res
}  

export const companyHandOver = async (variables: any) => {
    const res = await client.mutate({
        mutation: COMPANY_HANDOVER,
        variables
    })
    return res
}