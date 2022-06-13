import { client } from "../apollo"
import { CITIES, CITY, EDUCATION_LEVEL, EDUCATION_LEVELS } from "../apollo/queries"

export const fetchCities = async () => {
    const res = await client.query({
        query: CITIES,
    })
    return res
}

export const fetchCity = async (vars: any) => {
    const res = await client.query({
        query: CITY,
        variables: vars
    })
    return res
}

export const fetchEducationLevels = async () => {
    const res = await client.query({
        query: EDUCATION_LEVELS
    })
    return res
}

export const fetchEducationLevel = async () => {
    const res = await client.query({
        query: EDUCATION_LEVEL
    })
    return res
}