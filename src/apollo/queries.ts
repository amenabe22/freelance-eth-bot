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
export const COMPANY_HANDOVER = gql`mutation ($object: entity_handovers_insert_input = {}) {
  insert_entity_handover(object: $object) {
    id
  }
}`

export const USER = gql`
  query getUser($telegram_id: String!) {
    users(where: { telegram_id: { _eq: $telegram_id } }) {
      id
      first_name
      last_name
      job_seeker{
        id
        cv
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
      user_entities(where: {
        entity: {
          type: {
            _eq: "COMPANY"
          }
        }
      }){
        entity {
          name
          id
        }
      }
    }
  }
  `
  export const USER_BY_PHONE = gql`
  query getUser($phone: String!) {
    users(where: { phone: { _eq: $phone } }) {
      id
      first_name
      last_name
    }
  }
  `
  export const USER_STARTUP = gql`
  query getUser($telegram_id: String!) {
    users(where: { telegram_id: { _eq: $telegram_id } }) {
      id
      first_name
      last_name
      job_seeker{
        id
        cv
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
      user_entities(where: {
        entity: {
          type: {
            _eq: "STARTUP"
          }
        }
      }){
        entity {
          name
          id
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

export const SECTORS = gql`query {
  sectors{
    id
    name
    description
  }
}`
export const SECTOR = gql`query getSector($name: citext!) {
  sectors(where: { name: { _eq: $name } }) {
    id
    name
  }
}
`

export const INSERT_JOB_SEEKER_SECTORS = gql`mutation($objs: [job_seeker_sectors_insert_input!]!) {
  insert_job_seeker_sectors(objects: $objs) {
    affected_rows
  }
}`

export const JOB_SEEKER = gql`
  query getUser($telegram_id: String!) {
    users(where: { telegram_id: { _eq: $telegram_id } }) {
      job_seeker{
        id
        cv
       }
    }
  }
  `