import * as hdler from "../handlers"
export const jobPostCompanyAction = {
    key: "jobPostCompany",
    handler: hdler.jobPostCompanyActionHandler
}

export const jobPostStartupSelectorAction = {
    key: "jobPostStartup",
    handler: hdler.jobPostStartupSelectorActionHandler
}
export const jobPostPrivateClientSelectorAction = {
    key: "jobPostPrivateClient",
    handler: hdler.jobPostPrivateSelectorActionHandler
}

export const jobPostCompanySelectorAction = {
    key: /^job_cmp_*.*$/,
    handler: hdler.jobPostCompanySelectorActionHandler
}

export const jobApplicationShortlistAction = {
    key: /^app_short_*.*$/,
    handler: hdler.jobApplicationShortlistActionHandler
}

export const jobApplicationRejectAction = {
    key: /^app_reject_*.*$/,
    handler: hdler.jobApplicationRejectActionHandler
}

export const jobApplicationPreviewAction = {
    key: /^app_prv_*.*$/,
    handler: hdler.jobApplicationPreviewActionHandler
}


export const jobApplicationReviewsAction = {
    key: /^app_reviews_*.*$/,
    handler: hdler.jobApplicationReviewsActionHandler
}

export const jobPostingConfirmHandler = {
    key: "confirmJobPost",
    handler: hdler.jobPostConfirmHandler
}
export const jobPostingEditHandler = {
    key: "editJobPost",
    handler: hdler.jobApplyEditInitHandler
}
export const jobApplyingConfirmHandlerAction = {
    key: "confirmJobApply",
    handler: hdler.jobApplyConfirmHandler
}
export const jobApplyingEditHandlerAction = {
    key: "editJobApply",
    handler: hdler.jobApplyEditInitHandler
}
export const jobPostingSelectFieldEditHandler = {
    key: ["jp-title", "jp-description", "jp-type", "jp-sector", "jp-salary", "jp-location", "jp-applicant", "jp-vacancy","jp-done"],
    handler: hdler.jobPostingSelectedFieldEditHandler
}
export const jobApplingSelectFieldHandlerAction = {
    key: ["ja-description", "ja-pf1", "ja-pf2", "ja-pf3", "ja-done"],
    handler: hdler.jobApplyingSelectedFieldEditHandler
}
export const doneJobPostPaymentSummeryHandlerAction = {
    key: /^donejobpostpaymentsum_*.*$/,   
    handler: hdler.doneJobPostPaymentSummeryHandler
}
export const doneJobPostProfileHandlerAction = {
    key: /^donejobpostprofile_*.*$/,   
    handler: hdler.doneJobPostProfileHandler
}
export const doneJobPostReviewRateHandlerAction = {
    key: /^donejobpostReviewandrate_*.*$/,   
    handler: hdler.doneJobPostReviewRateHandler
}
export const activeJobPostDoneHandlerAction = {
    key: /^activejobpostdone_*.*$/, 
    handler: hdler.activeJobPostDoneHandler
}
export const activeJobPostProfileHandlerAction = {
    key: /^activejobpostprofile_*.*$/,  
    handler: hdler.activeJobPostProfileHandler
}
export const activeJobPostPayHandlerAction = { 
    key: /^activejobpostpay_*.*$/,
    handler: hdler.activeJobPostPayHandler
} 
export const activeJobPostReviewHandlerAction = {
    key: /^activejobpostreview_*.*$/,
    handler: hdler.activeJobPostReviewHandler
} 
export const activeJobPostPayForEmployeeHandlerAction = {
    key: /^activeJobpayforemployee_*.*$/,
    handler: hdler.activeJobPostPayForEmployeeHandler
}
export const activeJobPostReviewForEmployeeHandlerAction = {
    key: /^activejobreviewemployee_*.*$/,
    handler: hdler.activeJobPostReviewForEmployeeHandler
}
export const activeJobPostYesPayForEmployeeHandlerAction = {
    key: /^jobpostyespay_*.*$/,
    handler: hdler.activeJobPostYesPayForEmployeeHandler
}
export const activeJobPostNoPayForEmployeeHandlerAction = {
    key: /^jobpostnodontpay_*.*$/,
    handler: hdler.activeJobPostNoPayForEmployeeHandler
}
export const activemyjobsReqestPaymentHandlerAction = {
    key: /^activemyjobsreqpayment_*.*$/,
    handler: hdler.activeMyJobsRequestPaymentHandler
}
export const activeMyJobsRequestReviewHandlerAction = {
     key: /^acitvemyjobsreqreview_*.*$/,
     handler: hdler.activeMyJobsRequestReviewHandler
}

export const activeMyJobYesSendPaymentRequestHandlerAction = {
    key: /^activemyjobYesendPrequest_*.*$/,
    handler: hdler.activeMyJobYesSendPaymentRequestHandler
}
export const activeMyJobNodontSendPaymentRequestHandlerAction = {
    key: /^activemyjobdontsendPrequest_*.*$/,
    handler: hdler.activeMyJobNodontSendPaymentRequestHandler
}