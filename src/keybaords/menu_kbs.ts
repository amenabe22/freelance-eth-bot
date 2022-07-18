export const englishMainMenuKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            keyboard: [
                [{ text: i18n.t("jobseekerBtnLabel") }, { text: i18n.t("employeerBtnLabel") }],
                [{ text: i18n.t("settingsBtnLabel") }, { text: i18n.t("helpBtnLabel") }],
            ], resize_keyboard: true, one_time_keyboard: true,
        }
    }
}
export const onlyMainMenuKeyboard = ({ i18n }: any) => {
   return{ 
    reply_markup: {
        keyboard: [
            [{ text: i18n.t("mainMenuBtnLabel") }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
   } 
}
export const skipKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Back" }], [{ text: "Skip" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}

export const cancelKeyboard = ({ i18n }: any) =>{
    return { 
        reply_markup: {
            keyboard: [
                [{ text: i18n.t("backBtnLabel") }]
            ], resize_keyboard: true, one_time_keyboard: true
        }
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
export const employerKeyboard = ({ i18n }: any) => {
    return {
        reply_markup: {
            keyboard: [
                [{ text: i18n.t("postJobBtnLabel") }],
                [{ text: i18n.t("myJobPostsBtnLabel") }, { text: i18n.t("myCompaniesAndStartupsBtnLabel") }],
                [{ text: i18n.t("Main Menu") }],
            ], resize_keyboard: true, one_time_keyboard: true,
        }
    }
}
export const chooseCompanyStartupKeyboard = ({ i18n }: any) =>{
   return { 
    parse_mode: "HTML",
    reply_markup: {
        keyboard: [
            [{ text: i18n.t("companyBtnLabel") }, { text: i18n.t("startupBtnLabel") }],
            [{ text: i18n.t("mainMenuBtnLabel") }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
   } 
}

export const choosePersonalizationOptionsupKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit Sectors", callback_data: "editPersonalizationSectors" },
            { text: "Edit Job Type", callback_data: "editPersonalizationJobType" }],

        ]
    }
}
