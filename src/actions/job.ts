import { jobPostCompanyActionHandler, jobPostCompanySelectorActionHandler, jobPostConfirmHandler, jobPostEditInitHandler, jobPostingSelectedFieldEditHandler, jobPostPrivateSelectorActionHandler, jobPostStartupSelectorActionHandler } from "../handlers"

export const jobPostCompanyAction = {
    key: "jobPostCompany",
    handler: jobPostCompanyActionHandler
}

export const jobPostStartupSelectorAction = {
    key: "jobPostStartup",
    handler: jobPostStartupSelectorActionHandler
}
export const jobPostPrivateClientSelectorAction = {
    key: "jobPostPrivateClient",
    handler: jobPostPrivateSelectorActionHandler
}

export const jobPostCompanySelectorAction = {
    key: /^job_cmp_*.*$/,
    handler: jobPostCompanySelectorActionHandler
}


export const jobPostingConfirmHandler = {
    key: "confirmJobPost",
    handler: jobPostConfirmHandler
}
export const jobPostingEditHandler = {
    key: "editJobPost",
    handler: jobPostEditInitHandler
}
export const jobPostingSelectFieldEditHandler = {
    key: ["jp-title", "jp-description", "jp-type", "jp-sector", "jp-salary", "jp-location", "jp-applicant", "jp-vacancy","jp-done"],
    handler: jobPostingSelectedFieldEditHandler
}
