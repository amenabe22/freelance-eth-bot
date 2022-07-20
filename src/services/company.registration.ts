import { REGISTER_USER, COMPANY_HANDOVER, COMPANY_EDIT } from "../apollo/queries"
import { client } from "../apollo"
import { ENTITY_ENDPOINT } from "../constants"
import axios from "axios"
import FormData from "form-data";
import * as qry from "../apollo/queries"
export const registerNewBotUser = async (variables: any) => {
    const res = await client.mutate({
        mutation: REGISTER_USER,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const registerCompany = async (formDataObj: FormData) => {
    const formData = new FormData();
    const res = await axios.post(ENTITY_ENDPOINT, formDataObj, {
        headers: formData.getHeaders()
    })
    return res
}  

export const companyHandOver = async (variables: any) => {
    const res = await client.mutate({
        mutation: COMPANY_HANDOVER,
        fetchPolicy: "network-only",
        variables
    })
    return res
}
export const companyEdit = async (variables: any) => {
    const res = await client.mutate({
        mutation: COMPANY_EDIT,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const entityHireCount = async (vars: any) => {
    const res = await client.query({
        query: qry.ENTITY_HIRE_COUNT,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}
export const privateClientHireCount = async (vars: any) => {
    const res = await client.query({
        query: qry.PRIVATE_CLIENT_HIRE_COUNT,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}

export const entityJobCount = async (vars: any) => {
    const res = await client.query({
        query: qry.ENTITY_jOB_COUNT,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}

export const userJobPostCount = async (vars: any) => {
    const res = await client.query({
        query: qry.USER_JOB_POST_COUNT,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}

