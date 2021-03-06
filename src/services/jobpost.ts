import { ALL_POSTED, APPLICATION, INSERT_APP, INSERT_JOB, INSER_SHORTLIST, JOB, JOB_TYPE_N, RATING_QUESTIONS, SEEKER_APPS } from "../apollo/queries"
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
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const fetchJobById = async (variables: any) => {
    const res = await client.query({
        query: JOB,
        variables
    })
    return res
}

export const inserShortList = async (variables: any) => {
    const res = await client.mutate({
        mutation: INSER_SHORTLIST,
        variables
    })
    return res
}
export const fetchRatingQuestions = async () => {
    const res = await client.query({
        query: RATING_QUESTIONS,
        fetchPolicy: "network-only",
    })
    return res
}
export const fetchApplication = async (variables: any) => {
    const res = await client.query({
        query: APPLICATION,
        variables
    })
    return res
}