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
export const companyKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('gmBtnLablel'), callback_data: "Genaral Manager" }, { text: i18n.t('repBtnLabel'), callback_data: "Representative" }]
            ]
        }
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
export const companyRegisterOptionalKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            keyboard: [
                [{ text: i18n.t("skipBtnLabel") }],
                [{ text: i18n.t("backBtnLabel") }],
            ], resize_keyboard: true, one_time_keyboard: true,
        }
    }
}
export const companyRegisterSocialMediaLinkYesNoKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Yes" }, { text: "No" }],
        ], resize_keyboard: true, one_time_keyboard: true
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
            [{ text: "Edit", callback_data: "editCompanyRegistring" }, { text: "Confirm", callback_data: "confirmRegisterCompanyGM" }],
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
export const registerStartupConfirmLGMKeyboard = ({ i18n }: any) =>{
 return {
    reply_markup: {
        inline_keyboard: [
            [{ text: i18n.t('editBtnLabel'), callback_data: "editStartupRegistringLGM" }, { text: i18n.t('confirmBtnLabel'), callback_data: "confirmRegisteringStartupLGM" }],

        ]
    }
 }   
}
export const registerStartupConfirmUGMKeyboard = ({ i18n }: any) =>{
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('editBtnLabel'), callback_data: "editStartupRegistringUGM" }, { text: i18n.t('confirmBtnLabel'), callback_data: "confirmRegisteringStartupUGM" }],
    
            ]
        }
    }
}
export const registerStartupConfirmLRKeyboard = ({ i18n }: any) =>{
 return {
    reply_markup: {
        inline_keyboard: [
            [{ text: i18n.t('editBtnLabel'), callback_data: "editStartupRegistringLR" }, { text: i18n.t('confirmBtnLabel'), callback_data: "confirmRegisteringStartupLR" }],

        ]
    }
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
export const registerStartupToBeEditFieldLGMKeyboard = ({ i18n }: any) =>{
 return {
    reply_markup: {
        inline_keyboard: [
            [{ text: i18n.t('companyStartupName'), callback_data: "name.LGM" }, { text: i18n.t('startupFounder1'), callback_data: "founderN1.LGM" }],
            [{ text: i18n.t('startupFounder2'), callback_data: "founderN2.LGM" }, { text: i18n.t('startupFounder3'), callback_data: "founderN3.LGM" }],
            [{ text: i18n.t('startupFounder4'), callback_data: "founderN4.LGM" }, { text: i18n.t('startupFounder5'), callback_data: "founderN5.LGM" }],
            [{ text: i18n.t('companyStartupEmployeeSize'), callback_data: "employee.LGM" }, { text: i18n.t('companyStartupSector'), callback_data: "sector.LGM" }],
            [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook.LGM" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram.LGM" }],
            [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube.LGM" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok.startupLGM" }],
            [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter.LGM" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin.LGM" }],
            [{ text: i18n.t('companyStartupOL1'), callback_data: "other1.LGM" }, { text: i18n.t('companyStartupOL2'), callback_data: "other2.LGM" }],
            [{ text: i18n.t('companyStartupOL3'), callback_data: "other3.LGM" }, { text: i18n.t('companyStartupEmail'), callback_data: "email.LGM" }],
            [{ text: i18n.t('companyStartupPhone'), callback_data: "phone.LGM" }, { text: i18n.t('companyStartupWebsite'), callback_data: "website.LGM" }],
            [{ text: i18n.t('companyStartupHQ'), callback_data: "location.LGM" }, {text: i18n.t('companyStartupDone'), callback_data: "done.LGM"}], 
        ]
    }
 }
}
//
export const registerStartupToBeEditFieldUGMKeyboard = ({ i18n }: any) =>{
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('companyStartupName'), callback_data: "name.UGM" }, { text: i18n.t('startupFounder1'), callback_data: "founderN1.UGM" }],
                [{ text: i18n.t('startupFounder2'), callback_data: "founderN2.UGM" }, { text: i18n.t('startupFounder3'), callback_data: "founderN3.UGM" }],
                [{ text: i18n.t('startupFounder4'), callback_data: "founderN4.UGM" }, { text: i18n.t('startupFounder5'), callback_data: "founderN5.UGM" }],
                [{ text: i18n.t('companyStartupEmployeeSize'), callback_data: "employee.UGM" }, { text: i18n.t('companyStartupSector'), callback_data: "sector.UGM" }],
                [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook.UGM" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram.UGM" }],
                [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube.UGM" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok.startupLGM" }],
                [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter.UGM" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin.UGM" }],
                [{ text: i18n.t('companyStartupOL1'), callback_data: "other1.UGM" }, { text: i18n.t('companyStartupOL2'), callback_data: "other2.UGM" }],
                [{ text: i18n.t('companyStartupOL3'), callback_data: "other3.UGM" }, { text: i18n.t('companyStartupEmail'), callback_data: "email.UGM" }],
                [{ text: i18n.t('companyStartupPhone'), callback_data: "phone.UGM" }, { text: i18n.t('companyStartupWebsite'), callback_data: "website.UGM" }],
                [{ text: i18n.t('companyStartupHQ'), callback_data: "location.UGM" }, {text: i18n.t('companyStartupDone'), callback_data: "done.UGM"}], 
            ]
        }
     }
}
export const registerStartupToBeEditFieldLRKeyboard = ({ i18n }: any) =>{
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('companyStartupName'), callback_data: "name.LR" }, { text: i18n.t('startupFounder1'), callback_data: "founderN1.LR" }],
                [{ text: i18n.t('startupFounder2'), callback_data: "founderN2.LR" }, { text: i18n.t('startupFounder3'), callback_data: "founderN3.LR" }],
                [{ text: i18n.t('startupFounder4'), callback_data: "founderN4.LR" }, { text: i18n.t('startupFounder5'), callback_data: "founderN5.LR" }],
                [{ text: i18n.t('companyStartupEmployeeSize'), callback_data: "employee.LR" }, { text: i18n.t('companyStartupSector'), callback_data: "sector.LR" }],
                [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook.LR" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram.LR" }],
                [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube.LR" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok.startupLGM" }],
                [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter.LR" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin.LR" }],
                [{ text: i18n.t('companyStartupOL1'), callback_data: "other1.LR" }, { text: i18n.t('companyStartupOL2'), callback_data: "other2.LR" }],
                [{ text: i18n.t('companyStartupOL3'), callback_data: "other3.LR" }, { text: i18n.t('companyStartupEmail'), callback_data: "email.LR" }],
                [{ text: i18n.t('companyStartupPhone'), callback_data: "phone.LR" }, { text: i18n.t('companyStartupWebsite'), callback_data: "website.LR" }],
                [{ text: i18n.t('companyStartupHQ'), callback_data: "location.LR" }, {text: i18n.t('companyStartupDone'), callback_data: "done.LR"}], 
            ]
        }
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
export const starupStatusKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('licensedBtnLabel'), callback_data: "LicensedStarup" }, { text: i18n.t('unlicensedBtnLabel'), callback_data: "UnlicensedStartup" }],
            ]
        }
    }
}
export const starupFounderKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            keyboard: [[{ text: i18n.t('doneBtnLabel') }, { text: i18n.t('backBtnLabel') }],], resize_keyboard: true, one_time_keyboard: true,
        }
    }
}
export const companyEditHandOverKeyboard = {
    reply_markup: {
        inline_keyboard: [[{ text: "Edit", callback_data: "edit-company" }, { text: "HandOver", callback_data: "hand-over-company" }]]
    }
}
export const startupEditHandOverKeyboard = {
    reply_markup: {
        inline_keyboard: [[{ text: "Edit", callback_data: "edit-startup" }, { text: "HandOver", callback_data: "hand-over-startup" }]]
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
            [{ text: "Add License", callback_data: "add_license_startup" }]
        ]
    }
}
export const socialMediaListLGMKeyboard = ({ i18n }: any) =>{
  return{
    reply_markup: {
        inline_keyboard: [
            [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook-linkLGM" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram-linkLGM"}],
            [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube-linkLGM" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok-linkLGM" }],
            [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter-linkLGM" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin-linkLGM" }],
            [{ text: i18n.t('companyStartupOL1'), callback_data: "otherlink1-linkLGM" }, { text: i18n.t('companyStartupOL2'), callback_data: "otherlink2-linkLGM" }],
            [{ text: i18n.t('companyStartupOL3'), callback_data: "otherlink3-linkLGM"}, { text: i18n.t('companyStartupDone'), callback_data: "done-linkLGM"}],
        ]
    }
  }
}
export const socialMediaListUGMKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook-linkUGM" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram-linkUGM" }],
                [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube-linkUGM" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok-linkUGM" }],
                [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter-linkUGM" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin-linkUGM" }],
                [{ text: i18n.t('companyStartupOL1'), callback_data: "otherlink1-linkUGM" }, { text: i18n.t('companyStartupOL2'), callback_data: "otherlink2-linkUGM" }],
                [{ text: i18n.t('companyStartupOL3'), callback_data: "otherlink3-linkUGM" }, { text: i18n.t('companyStartupDone'), callback_data: "done-linkUGM" }],
            ]
        }
    }
}
export const socialMediaListLRKeyboard = ({ i18n }: any) =>{
  return{
    reply_markup: {
        inline_keyboard: [
            [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook-linkLR" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram-linkLR"}],
            [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube-linkLR" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok-linkLR" }],
            [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter-linkLR" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin-linkLR" }],
            [{ text: i18n.t('companyStartupOL1'), callback_data: "otherlink1-linkLR" }, { text: i18n.t('companyStartupOL2'), callback_data: "otherlink2-linkLR" }],
            [{ text: i18n.t('companyStartupOL3'), callback_data: "otherlink3-linkLR"}, { text: i18n.t('companyStartupDone'), callback_data: "done-linkLR"}],
        ]
    }
  }
}
// export const socialMediaListURKeyboard = {
//     reply_markup: {
//         inline_keyboard: [
//             [{ text: "facebook link", callback_data: "facebook-linkUR" }, { text: "Telegram link", callback_data: "telegram-linkUR"}],
//             [{ text: "YouTube link", callback_data: "youtube-linkUR" }, { text: "TikTok link", callback_data: "tiktok-linkUR" }],
//             [{ text: "Twitter link", callback_data: "twitter-linkUR" }, { text: "LinkedIn link", callback_data: "linkedin-linkUR" }],
//             [{ text: "Other Link 1", callback_data: "otherlink1-linkUR" }, { text: "Other link 2", callback_data: "otherlink2-linkUR" }],
//             [{ text: "Other Link 3", callback_data: "otherlink3-linkUR"}, { text: "Done", callback_data: "done-linkUR"}],
//         ]
//     }
// }
export const socialMediaListCRKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: i18n.t('companyStartupFbLink'), callback_data: "facebook-linkCR" }, { text: i18n.t('companyStartupTgLink'), callback_data: "telegram-linkCR" }],
                [{ text: i18n.t('companyStartupYTLink'), callback_data: "youtube-linkCR" }, { text: i18n.t('companyStartupTTLink'), callback_data: "tiktok-linkCR" }],
                [{ text: i18n.t('companyStartupTwitterLink'), callback_data: "twitter-linkCR" }, { text: i18n.t('companyStartupLILink'), callback_data: "linkedin-linkCR" }],
                [{ text: i18n.t('companyStartupOL1'), callback_data: "otherlink1-linkCR" }, { text: i18n.t('companyStartupOL2'), callback_data: "otherlink2-linkCR" }],
                [{ text: i18n.t('companyStartupOL3'), callback_data: "otherlink3-linkCR" }, { text: i18n.t('companyStartupDone'), callback_data: "done-linkCR" }],
            ]
        }
    }
}
export const socialMediaListCGMKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "facebook link", callback_data: "facebook-linkCGM" }, { text: "Telegram link", callback_data: "telegram-linkCGM" }],
            [{ text: "YouTube link", callback_data: "youtube-linkCGM" }, { text: "TikTok link", callback_data: "tiktok-linkCGM" }],
            [{ text: "Twitter link", callback_data: "twitter-linkCGM" }, { text: "LinkedIn link", callback_data: "linkedin-linkCGM" }],
            [{ text: "Other Link 1", callback_data: "otherlink1-linkCGM" }, { text: "Other link 2", callback_data: "otherlink2-linkCGM" }],
            [{ text: "Other Link 3", callback_data: "otherlink3-linkCGM" }, { text: "Done", callback_data: "done-linkCGM" }],
        ]
    }
}
export const socialMediaYesNoKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            keyboard: [
                [{ text: i18n.t('yesBtnLabel') }, { text: i18n.t('noBtnLabel') }],
                [{ text: i18n.t('backBtnLabel') }],
            ], resize_keyboard: true, one_time_keyboard: true,
        }
    }
}