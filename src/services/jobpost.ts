import { INSERT_JOB, JOB_TYPE_N } from "../apollo/queries"
import { client } from "../apollo"

export const inserJobPost = async (variables: any) => {
    const res = await client.mutate({
        mutation: INSERT_JOB,
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