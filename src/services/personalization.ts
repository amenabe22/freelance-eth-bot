import { client } from "../apollo"
import * as qry from "../apollo/queries"

export const registerJobSeekerPersonalizedJob = async (variables: any) => {
    const res = await client.mutate({
        mutation: qry.INSERT_JOB_SEEKER_SECTORS,
        variables
    })
    return res
}