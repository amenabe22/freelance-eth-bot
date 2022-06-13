import { REGISTER_USER, USER } from "../apollo/queries"
import { client } from "../apollo"

export const registerNewBotUser = async (variables: any) => {
    const res = await client.mutate({
        mutation: REGISTER_USER,
        variables
    })
    return res
}

export const getUserByTelegramId = async (variables: any) => {
    const res = await client.query({
        query: USER,
        variables
    })
    return res
}