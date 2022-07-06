import { jobPostCompanyActionHandler, jobPostCompanySelectorActionHandler, jobPostStartupSelectorActionHandler } from "../handlers"

export const jobPostCompanyAction = {
    key: "jobPostCompany",
    handler: jobPostCompanyActionHandler
}

export const jobPostStartupSelectorAction = {
    key: ["jobPostStartup", "jobPostPrivateClient"],
    handler: jobPostStartupSelectorActionHandler
}


export const jobPostCompanySelectorAction = {
    key: /^job_cmp_*.*$/,
    handler: jobPostCompanySelectorActionHandler
}

