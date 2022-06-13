import { gql } from "@apollo/client/core"

export const CITIES = gql`query {
  cities{
    id
    name
  }
}`


export const CITY = gql`query getCity($name: citext!) {
  cities(where: { name: { _eq: $name } }) {
    id
    name
  }
}
`

export const REGISTER_USER = gql`mutation($obj: RegisterUserInput!) {
  register_user(user: $obj) {
    id
  }
}
`

export const USER = gql`
  query getUser($telegram_id: String!) {
    users(where: { telegram_id: { _eq: $telegram_id } }) {
      id
      first_name
      last_name
      job_seeker{
        id
        availability_status
        work_status{
          id
          name
        }
        education_level{
          id
          name
        }
      }
    }
  }
  `

export const EDUCATION_LEVELS = gql`query {
  education_levels{
    id
    name
  }
}`

export const EDUCATION_LEVEL = gql`query getEducationalLevel($name: citext!) {
  education_levels(where: {
    name: {
      _eq: $name
    }
  }) {
  id                  
  }
}`

export const WORK_STATUSES = gql`query {
  work_statuses {
    id
    name
  }
}
`

export const WORK_STATUS = gql`query getWorkStatus($name: citext!) {
  work_statuses(where: {
    name: {
      _eq: $name
    }
  }) {
  id                  
  }
}`

export const INSERT_JOB_SEEKER = gql`mutation($obj: job_seekers_insert_input!) {
  insert_job_seeker(object: $obj) {
    id
  }
}`