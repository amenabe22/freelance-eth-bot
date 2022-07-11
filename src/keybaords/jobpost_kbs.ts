export const choosePostJobKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Company", callback_data: "jobPostCompany" }, { text: "Startup", callback_data: "jobPostStartup" }],
            [{ text: "Private Client", callback_data: "jobPostPrivateClient" }]
        ]
    }
}
export const myJobPostCompanyKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Company #1", callback_data: "c1" }, { text: "Company #2", callback_data: "c2" }],
            [{ text: "Company #3", callback_data: "c3" }, { text: "Company #4", callback_data: "c4" }],
            [{ text: "Company #5", callback_data: "c5" }, { text: "Company #6", callback_data: "c6" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const postAJobTypeKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Unpaid Intern" }, { text: "Paid Intern" }],
            [{ text: "Contractual" }, { text: "Remote" }],
            [{ text: "Part time" }, { text: "Freelancer" }],
            [{ text: "Permanent" }],
            [{ text: "Back" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const postAJobSectorKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Computer Science" }, { text: "Construction" }],
            [{ text: "Retail" }, { text: "Accounting" }],
            [{ text: "Creative" }, { text: "Banking" }],
            [{ text: "Architecture" }, { text: "Law" }],
            [{ text: "Hospitality" }], [{ text: "Cancel" }]
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const applicationStateCancelBtn = {
    reply_markup: {
        keyboard: [
            [{ text: "Cancel" }]
        ]
    }
}
export const postAJobOptionalKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Skip" }],
            [{ text: "Back" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const confirmPostJobKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Confirm", callback_data: "confirmJobPost" }, { text: "Edit", callback_data: "editJobPost" }]
        ]
    }
}
export const editJobPostKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Title", callback_data: "jp-title" }, { text: "Description", callback_data: "jp-description" }],
            [{ text: "Job Type", callback_data: "jp-type" }, { text: "Job Sector", callback_data: "jp-sector" }],
            [{ text: "Salary", callback_data: "jp-salary" }, { text: "Location", callback_data: "jp-location" }],
            [{ text: "Aplicant Needed", callback_data: "jp-applicant" }, { text: "Vacancy Number", callback_data: "jp-vacancy" }],
            [{ text: "Done", callback_data: "jp-done" }]
        ]
    }
}
export const myJobPostsKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Opened" }, { text: "Closed" }],
            [{ text: "Pending" }, { text: "Declined" }],
            [{ text: "Active" }, { text: "Done" }],
            [{ text: "Main Menu" },]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}