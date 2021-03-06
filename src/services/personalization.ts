import { client } from "../apollo"
import * as qry from "../apollo/queries"

export const registerJobSeekerPersonalizedJob = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.INSERT_JOB_SEEKER_SECTORS,
        variables
    })
    return res
}

export const insertJobSeekerJobType = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.INSERT_JOB_SEEKER_TYPE,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const insertJobSeekerSector = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.INSERT_JOB_SEEKER_SECTORS,
        variables
    })
    return res
}

export const getJobSeekerId = async (variables: any) => {
    const res = await client.query({
        query: qry.JOB_SEEKER,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const getJobSeekerSectors = async (variables: any) => {
    const res = await client.query({
        query: qry.JOB_SEEKER_SECTORS,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const getJobSeekerTypes = async (variables: any) => {
    const res = await client.query({
        query: qry.JOB_SEEKER_TYPES,
        fetchPolicy: "network-only",
        variables
    })
    return res
}