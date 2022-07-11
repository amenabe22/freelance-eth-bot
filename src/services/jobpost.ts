import { ALL_POSTED, INSERT_APP, INSERT_JOB, JOB, JOB_TYPE_N, SEEKER_APPS } from "../apollo/queries"
import { client } from "../apollo"

export const inserJobPost = async (variables: any) => {
    const res = await client.mutate({
        mutation: INSERT_JOB,
        variables
    })
    return res
}

export const fetchJob = async (variables: any) => {
    const res = await client.query({
        query: JOB,
        variables
    })
    return res
}
export const jobTypeN = async (variables: any) => {
    const res = await client.mutate({
        mutation: JOB_TYPE_N,
        variables
    })
    return res
}

export const insertApplication = async (variables: any) => {
    const res = await client.mutate({
        mutation: INSERT_APP,
        variables
    })
    return res
}

export const seekerApplications = async (variables: any) => {
    const res = await client.query({
        query: SEEKER_APPS,
        variables
    })
    return res
}

export const fetchAllPostedJobs = async (variables: any) => {
    const res = await client.query({
        query: ALL_POSTED,
        variables
    })
    return res
}