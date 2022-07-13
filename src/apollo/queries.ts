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

export const COMPANY_EDIT = gql`mutation($id: uuid!, $set: entities_set_input!) {
  update_entity(pk_columns: {
    id: $id
  }, _set: $set) {
    id
  }
}`
export const USER_ST = gql`
query getUser($telegram_id: String!) {
  users(where: { telegram_id: { _eq: $telegram_id } }) {
    id
    first_name
    last_name
    phone
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
        verified_at
      }
    }
  }
}
`

export const USER = gql`
  query getUser($telegram_id: String!) {
    users(where: { telegram_id: { _eq: $telegram_id } }) {
      id
      first_name
      last_name
      phone
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
          verified_at
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
          verified_at
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
export const SECTOR_BY_ID = gql`query getSector($id: uuid!) {
  sectors(where: { id: { _eq: $id } }) {
    id
    name
  }
}
`
export const INSERT_JOB_SEEKER_TYPE = gql`mutation($objs: [job_seeker_job_types_insert_input!]!) {
  insert_job_seeker_job_types(objects: $objs) {
    affected_rows
  }
}`

export const INSERT_JOB_SEEKER_SECTORS = gql`mutation($objs: [job_seeker_sectors_insert_input!]!) {
  insert_job_seeker_sectors(objects: $objs) {
    affected_rows
  }
}`

export const JOB_SEEKER_SECTORS = gql`query($job_seeker_id: uuid!) {
  job_seeker_sectors(where: {
    job_seeker_id: {
      _eq: $job_seeker_id
    }
  }) {
    id
    sector {
      id
      name
    }
  }
}`

export const JOB_TYPE_N = gql`query job_types($name: citext!) {
  job_types(where: { name: { _eq: $name } }) {
    id
    name
    description
  }
}`

export const JOB_TYPES = gql`query{
  job_types{
    created_at
    id
    name
  }
}
`
export const JOB_SEEKER_TYPES = gql`query ($job_seeker_id: uuid!) {
  job_seeker_job_types(where: {job_seeker_id: {_eq: $job_seeker_id}}) {
    id
    job_type {
      id
      name
    }
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

export const USER_EM = gql`query getUser($email: citext!) {
    users(where: { email: { _eq: $email } }) {
    email    
    }
  }`

export const USER_EMAIL_ENTITY = gql`query getUser($email: citext!) {
    entities(where: { email: { _eq: $email } }) {
    email    
    }
  }`

export const INSERT_JOB = gql`mutation insert_jobs_one($object: jobs_insert_input!) {
  insert_jobs_one(object: $object) {
    id
  }
}`

export const JOB = gql`query jobs($id: uuid!) {
  jobs(where: { id: { _eq: $id } }) {
    id
    title
		description
		job_type{
			name
		}
		 
  }  
}`

export const INSERT_APP = gql`mutation insertapp($object: applications_insert_input!) {
  insert_applications_one(object: $object) {
    id
    from_platform_id
    job {
      title
      description
      id
    }
    created_at
  }
}`

export const SEEKER_APPS = gql`query app($seeker: uuid!, $status: job_status!) {
  applications(
    where: {
      job_seeker_id: { _eq: $seeker }
      job: { status: { _eq: $status } }
    }
  ) {
    id
    description
    job {
      id
      title
      status
    }
    job_seeker {
      id
      user {
        id
        first_name
      }
    }
  }
}

`

export const ALL_POSTED = gql`query jobs($creator: uuid!, $status: job_status!) {
  jobs(where: { created_by: { _eq: $creator }, status: { _eq: $status } }) {
    rejected_by
    title
    status
    description
    created_at
    id
    applications{
      id
      job_seeker{
        user{
          id
          telegram_id
          first_name
          last_name
        }
      }
    }
    job_type{
      name
    }
  }
}
`

export const INSER_SHORTLIST = gql`mutation insert_short_lists_one($object: short_lists_insert_input!) {
  insert_short_lists_one(object: $object) {
    application {
      id
    }
  }
}`


export const APPLICATION = gql`query applications($id:uuid!){
  applications(where:{
    id:{
      _eq: $id
    }
  }){
    id
    job_seeker{
      education_level{
        name
      }      
      user{
        first_name
        last_name
      	date_of_birth
        gender
        email
        phone
        city{
        	name
        }
      }
    }
  }
}`