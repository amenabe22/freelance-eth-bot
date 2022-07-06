import { JOB_TYPES, REGISTER_USER, USER, USER_BY_PHONE, USER_EM, USER_EMAIL_ENTITY, USER_ST, USER_STARTUP } from "../apollo/queries"
import { client } from "../apollo"

export const registerNewBotUser = async (variables: any) => {
    const res = await client.mutate({
        mutation: REGISTER_USER,
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const getUserByTelegramStEntId = async (variables: any) => {
    const res = await client.query({
        query: USER_ST,
        // to avoid caching
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const getUserByTelegramId = async (variables: any) => {
    const res = await client.query({
        query: USER,
        // to avoid caching
        fetchPolicy: "network-only",
        variables
    })
    return res
}
export const getUserByPhone = async (variables: any) => {
    const res = await client.query({
        query: USER_BY_PHONE,
        // to avoid caching
        fetchPolicy: "network-only",
        variables
    })
    return res
}
export const getUserByTelegramIdStartup = async (variables: any) => {
    const res = await client.query({
        query: USER_STARTUP,
        // to avoid caching
        fetchPolicy: "network-only",
        variables
    })
    return res
}

export const verifyEmail = async (variables: any) => {
    const res = await client.query({
        query: USER_EM,
        fetchPolicy: "network-only",
        variables
    })
    return res
}
export const verifyEmailEntity = async (variables: any) => {
    const res = await client.query({
        query: USER_EMAIL_ENTITY,
        fetchPolicy: "network-only",
        variables
    })
    return res
}
export const fetchJobTypes = async () => {
    const res = await client.query({
        query: JOB_TYPES,
        fetchPolicy: "network-only",
    })
    return res

}