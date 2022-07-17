import { client } from "../apollo"
import * as qry from "../apollo/queries"

export const fetchCities = async () => {
    const res = await client.query({
        query: qry.CITIES,
        fetchPolicy: "network-only",
    })
    return res
}

export const fetchCity = async (vars: any) => {
    const res = await client.query({
        query: qry.CITY,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}

export const fetchEducationLevels = async () => {
    const res = await client.query({
        query: qry.EDUCATION_LEVELS,
        fetchPolicy: "network-only",
    })
    return res
}

export const fetchEducationLevel = async (variables: any) => {
    const res = await client.query({
        query: qry.EDUCATION_LEVEL,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const fetchWorkStatuses = async () => {
    const res = await client.query({
        query: qry.WORK_STATUSES,
        fetchPolicy: "network-only",
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
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const fetchSectors = async () => {
    const res = await client.query({
        query: qry.SECTORS,
        fetchPolicy: "network-only",
    })
    return res
}
export const fetchSectorById = async (vars: any) => {
    const res = await client.query({
        query: qry.SECTOR_BY_ID,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}


export const fetchSector = async (vars: any) => {
    const res = await client.query({
        query: qry.SECTOR,
        fetchPolicy: "network-only",
        variables: vars
    })
    return res
}


export const updateLanguage = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.UPDATE_LANGUAGE,
        variables
    })
    return res
}




