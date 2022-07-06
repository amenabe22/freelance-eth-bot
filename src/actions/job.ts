import { jobPostCompanyActionHandler, jobPostCompanySelectorActionHandler } from "../handlers"

export const jobPostCompanyAction = {
    key: "jobPostCompany",
    handler: jobPostCompanyActionHandler
}


export const jobPostCompanySelectorAction = {
    key: ["c1", "c2", "c3", "c4", "c5", "c6", "jobPostStartup", "jobPostPrivateClient"],
    handler: jobPostCompanySelectorActionHandler
}

