export const registerCompanyREditKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edr.name" }, { text: "Sector", callback_data: "edr.sector" }],
            [{ text: "Phone", callback_data: "edr.phone" }, { text: "Website", callback_data: "edr.website" }],
            [{ text: "Email", callback_data: "edr.email" }, { text: "HeadQuarters", callback_data: "edr.hqs" }]
        ]
    }
}
export const registerCompanyEditKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edc.name" }, { text: "Sector", callback_data: "edc.sector" }],
            [{ text: "Phone", callback_data: "edc.phone" }, { text: "Website", callback_data: "edc.website" }],
            [{ text: "Email", callback_data: "edc.email" }, { text: "HeadQuarters", callback_data: "edc.hqs" }]
        ]
    }
}
export const chooseCompanyStartupKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Company" }, { text: "Startup" }],
            [{ text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const companyKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "G/Manager", callback_data: "Genaral Manager" }, { text: "Representative", callback_data: "Representative" }]
        ]
    }
}
export const LicensedStartupKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Startup Manager", callback_data: "StartupLicensedGM" }, { text: "Startup Representative", callback_data: "StartupLicensedR" }]
        ]
    }
}
export const UnlicensedStartupKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "General Manager", callback_data: "StartupUnlicensedGM" }, { text: "Representative", callback_data: "StartupUnlicensedR" }]
        ]
    }
}
export const companyRegisterOptionalKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Skip" }],
            [{ text: "Back" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const startupRegisterOptionalKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Skip" }],
            [{ text: "Back" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const registerCompanyConfirmKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editCompanyRegistring" }, { text: "Confirm", callback_data: "confirmRegisterCompany" }],

        ]
    }
}
export const registerCompanyConfirmGMKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editCompanyRegistringGM" }, { text: "Confirm", callback_data: "confirmRegisterCompanyGM" }],
        ]
    }
}
export const registerStartupConfirmLGMKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editStartupRegistringLGM" }, { text: "Confirm", callback_data: "confirmRegisteringStartupLGM" }],

        ]
    }
}
export const registerStartupConfirmUGMKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editStartupRegistringUGM" }, { text: "Confirm", callback_data: "confirmRegisteringStartupUGM" }],

        ]
    }
}
export const registerStartupConfirmLRKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editStartupRegistringLR" }, { text: "Confirm", callback_data: "confirmRegisteringStartupLR" }],

        ]
    }
}
export const registerStartupConfirmURKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editStartupRegistringUR" }, { text: "Confirm", callback_data: "confirmRegisteringStartupUR" }],

        ]
    }
}

export const listOfCompanyRegisterdKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Company #1", callback_data: "c11" }, { text: "Company #2", callback_data: "c22" }],
            [{ text: "Company #3", callback_data: "c33" }, { text: "Company #4", callback_data: "c44" }],
            [{ text: "Company #5", callback_data: "c55" }, { text: "Company #6", callback_data: "c66" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const registerCompanyToBeEditFieldRKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "Name of Company" }, { text: "Employee Size", callback_data: "Employee size of company" }],
            [{ text: "Email", callback_data: "Company email" }, { text: "Phone No", callback_data: "Company phone number" }],
            [{ text: "Address", callback_data: "Company location" }, { text: "Website", callback_data: "Company website" }],
        ]
    }
}
export const registerCompanyToBeEditFieldGMKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "Name of-Company" }, { text: "Employee Size", callback_data: "EmployeeSize -of-Company" }],
            [{ text: "Email", callback_data: "Email of-Company" }, { text: "Phone No", callback_data: "PhoneNumber of-Company" }],
            [{ text: "Location", callback_data: "Location of-Company" }, { text: "Website", callback_data: "Website of-Company" }],
        ]
    }
}
export const registerStartupToBeEditFieldLGMKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "name.LGM" }, { text: "Founder Name 1", callback_data: "founderN1.LGM" }],
            [{ text: "Founder Name 2", callback_data: "founderN2.LGM" }, { text: "Founder Name 3", callback_data: "founderN3.LGM" }],
            [{ text: "Founder Name 4", callback_data: "founderN3.LGM" }, { text: "Founder Name 5", callback_data: "founderN5.LGM" }],
            [{ text: "Employee Size", callback_data: "employee.LGM" }, { text: "Sector", callback_data: "sector.LGM" }],
            [{ text: "Facebook Link", callback_data: "facebook.LGM" }, { text: "Telegram Link", callback_data: "telegram.LGM" }],
            [{ text: "YouTube Link", callback_data: "youtube.LGM" }, { text: "TikTok Link", callback_data: "tiktok.startupLGM" }],
            [{ text: "TwitterLink", callback_data: "twitter.LGM" }, { text: "LinkedIn Link", callback_data: "linkedin.LGM" }],
            [{ text: "Other Link 1", callback_data: "other1.LGM" }, { text: "Other Link 2", callback_data: "other2.LGM" }],
            [{ text: "Other LInk 3", callback_data: "other3.LGM" }, { text: "Email", callback_data: "email.LGM" }],
            [{ text: "Phone No", callback_data: "phone.LGM" }, { text: "Website", callback_data: "website.LGM" }],
            [{ text: "Location", callback_data: "location.LGM" }],
        ]
    }
}
export const registerStartupToBeEditFieldUGMKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "name.UGM" }, { text: "Founder Name 1", callback_data: "founderN1.UGM" }],
            [{ text: "Founder Name 2", callback_data: "founderN2.UGM" }, { text: "Founder Name 3", callback_data: "founderN3.UGM" }],
            [{ text: "Founder Name 4", callback_data: "founderN3.UGM" }, { text: "Founder Name 5", callback_data: "founderN5.UGM" }],
            [{ text: "Employee Size", callback_data: "employee.UGM" }, { text: "Sector", callback_data: "sector.UGM" }],
            [{ text: "Facebook Link", callback_data: "facebook.UGM" }, { text: "Telegram Link", callback_data: "telegram.UGM" }],
            [{ text: "YouTube Link", callback_data: "youtube.UGM" }, { text: "TikTok Link", callback_data: "tiktok.startupLGM" }],
            [{ text: "TwitterLink", callback_data: "twitter.UGM" }, { text: "LinkedIn Link", callback_data: "linkedin.UGM" }],
            [{ text: "Other Link 1", callback_data: "other1.UGM" }, { text: "Other Link 2", callback_data: "other2.UGM" }],
            [{ text: "Other LInk 3", callback_data: "other3.UGM" }, { text: "Email", callback_data: "email.UGM" }],
            [{ text: "Phone No", callback_data: "phone.UGM" }, { text: "Website", callback_data: "website.UGM" }],
            [{ text: "Location", callback_data: "location.UGM" }],
        ]
    }
}
export const registerStartupToBeEditFieldLRKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "name.LR" }, { text: "Founder Name 1", callback_data: "founderN1.LR" }],
            [{ text: "Founder Name 2", callback_data: "founderN2.LR" }, { text: "Founder Name 3", callback_data: "founderN3.LR" }],
            [{ text: "Founder Name 4", callback_data: "founderN3.LR" }, { text: "Founder Name 5", callback_data: "founderN5.LR" }],
            [{ text: "Employee Size", callback_data: "employee.LR" }, { text: "Sector", callback_data: "sector.LR" }],
            [{ text: "Facebook Link", callback_data: "facebook.LR" }, { text: "Telegram Link", callback_data: "telegram.LR" }],
            [{ text: "YouTube Link", callback_data: "youtube.LR" }, { text: "TikTok Link", callback_data: "tiktok.startupLGM" }],
            [{ text: "TwitterLink", callback_data: "twitter.LR" }, { text: "LinkedIn Link", callback_data: "linkedin.LR" }],
            [{ text: "Other Link 1", callback_data: "other1.LR" }, { text: "Other Link 2", callback_data: "other2.LR" }],
            [{ text: "Other LInk 3", callback_data: "other3.LR" }, { text: "Email", callback_data: "email.LR" }],
            [{ text: "Phone No", callback_data: "phone.LR" }, { text: "Website", callback_data: "website.LR" }],
            [{ text: "Location", callback_data: "location.LR" }],
        ]
    }
}
export const registerStartupToBeEditFieldURKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "name.UR" }, { text: "Founder Name 1", callback_data: "founderN1.UR" }],
            [{ text: "Founder Name 2", callback_data: "founderN2.UR" }, { text: "Founder Name 3", callback_data: "founderN3.UR" }],
            [{ text: "Founder Name 4", callback_data: "founderN3.UR" }, { text: "Founder Name 5", callback_data: "founderN5.UR" }],
            [{ text: "Employee Size", callback_data: "employee.UR" }, { text: "Sector", callback_data: "sector.UR" }],
            [{ text: "Facebook Link", callback_data: "facebook.UR" }, { text: "Telegram Link", callback_data: "telegram.UR" }],
            [{ text: "YouTube Link", callback_data: "youtube.UR" }, { text: "TikTok Link", callback_data: "tiktok.startupLGM" }],
            [{ text: "TwitterLink", callback_data: "twitter.UR" }, { text: "LinkedIn Link", callback_data: "linkedin.UR" }],
            [{ text: "Other Link 1", callback_data: "other1.UR" }, { text: "Other Link 2", callback_data: "other2.UR" }],
            [{ text: "Other LInk 3", callback_data: "other3.UR" }, { text: "Email", callback_data: "email.UR" }],
            [{ text: "Phone No", callback_data: "phone.UR" }, { text: "Website", callback_data: "website.UR" }],
            [{ text: "Location", callback_data: "location.UR" }],
        ]
    }
}
export const starupStatusKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Licensed", callback_data: "LicensedStarup" }, { text: "Unlicensed", callback_data: "UnlicensedStartup" }],
        ]
    }
}
export const starupFounderKeyboard = {
    reply_markup: {
        keyboard: [[{ text: "Done " }, { text: "Back" }],], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const companyEditHandOverKeyboard = {
    reply_markup: {
        inline_keyboard:[[{text: "Edit", callback_data: "edit-company"}, {text: "HandOver", callback_data: "hand-over-company"}]]
    }
}
export const startupEditHandOverKeyboard = {
    reply_markup: {
        inline_keyboard:[[{text: "Edit", callback_data: "edit-startup"}, {text: "HandOver", callback_data: "hand-over-startup"}]]
    }
}
export const companyEditKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edit_name_of_company" }, { text: "Employee Size", callback_data: "edit_employee_of_company" }],
            [{ text: "Email", callback_data: "edit_email_of_company" }, { text: "Phone No", callback_data: "edit_phone_of_company" }],
            [{ text: "Location", callback_data: "edit_location_of_company" }, { text: "Website", callback_data: "edit_websit_of_company" }],
        ]
    }
}
export const startupEditKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edit_name_of_startup" }, { text: "Employee Size", callback_data: "edit_employee_of_startup" }],
            [{ text: "Email", callback_data: "edit_email_of_startup" }, { text: "Phone No", callback_data: "edit_phone_of_startup" }],
            [{ text: "Location", callback_data: "edit_location_of_startup" }, { text: "Website", callback_data: "edit_websit_of_startup" }],
            [{ text: "Add License", callback_data: "add_license_startup"}]
        ]
    } 
}