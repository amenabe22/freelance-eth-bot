import { client } from "../apollo"
import * as qry from "../apollo/queries"

export const fetchCities = async () => {
    const res = await client.query({
        query: qry.CITIES,
    })
    return res
}

export const fetchCity = async (vars: any) => {
    const res = await client.query({
        query: qry.CITY,
        variables: vars
    })
    return res
}

export const fetchEducationLevels = async () => {
    const res = await client.query({
        query: qry.EDUCATION_LEVELS
    })
    return res
}

export const fetchEducationLevel = async (variables: any) => {
    const res = await client.query({
        query: qry.EDUCATION_LEVEL,
        variables
    })
    return res
}

export const fetchWorkStatuses = async () => {
    const res = await client.query({
        query: qry.WORK_STATUSES
    })
    return res
}

export const fetchWorkStatus = async (variables: any) => {
    const res = await client.query({
        query: qry.WORK_STATUS,
        variables
    })
    return res
}

export const insertJobSeeker = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.INSERT_JOB_SEEKER,
        variables
    })
    return res
}