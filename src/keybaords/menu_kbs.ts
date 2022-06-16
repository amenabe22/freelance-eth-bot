export const englishMainMenuKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Job Seeker" }, { text: "Employer" }],
            [{ text: "Settings" }, { text: "Help" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const amharicMainMenuKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Job Seeker" }, { text: "Employer" }],
            [{ text: "Settings" }, { text: "Help" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const onlyMainMenuKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Main Menu" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}
export const cancelKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Back" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}
export const onlyMainMenuKeyboardAM = {

    reply_markup: {
        keyboard: [
            [{ text: "ዋና ማውጫ" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}
export const jobSeekerKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Personalized Jobs" }],
            [{ text: "Upload CV" }, { text: "My Jobs" }],
            [{ text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const employerKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Post a Job" }],
            [{ text: "My Job Posts" }, { text: "My Companies / Startup" }],
            [{ text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const chooseCompanyStartupKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        keyboard:[
            [{text: "Company"}, {text: "Startup"}],
            [{text: "Main Menu"}],
        ],resize_keyboard: true, one_time_keyboard:true,
    }
}