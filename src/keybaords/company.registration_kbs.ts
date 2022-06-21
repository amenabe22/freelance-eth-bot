export const chooseCompanyStartupKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        keyboard:[
            [{text: "Company"}, {text: "Startup"}],
            [{text: "Main Menu"}],
        ],resize_keyboard: true, one_time_keyboard:true,
    }
}
export const companyKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [{text: "G/Manager", callback_data: "Genaral Manager"}, {text: "Representative", callback_data: "Representative"}]
        ]
    }
}
export const LicensedStartupKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [{text: "Startup Manager", callback_data: "StartupLicensedGM"}, {text: "Startup Representative", callback_data: "StartupLicensedR"}]
        ]
    }
}
export const UnlicensedStartupKeyboard = {
        parse_mode: "HTML",
        reply_markup:{
            inline_keyboard: [
                [{text: "General Manager", callback_data: "StartupUnlicensedGM"}, {text: "Representative", callback_data: "StartupUnlicensedR"}]
            ]
        } 
}
export const companyRegisterOptionalKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        keyboard:[
            [{text: "Skip"}],
            [{text: "Back"}],
        ],resize_keyboard: true, one_time_keyboard:true,
    }
}
export const startupRegisterOptionalKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        keyboard:[
            [{text: "Skip"}],
            [{text: "Back"}],
        ],resize_keyboard: true, one_time_keyboard:true,
    } 
}
export const registerCompanyConfirmKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editCompanyRegistring"}, {text: "Confirm", callback_data: "confirmRegisterCompany"}],
            
        ]
    }
}
export const registerCompanyConfirmGMKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editCompanyRegistringGM"}, {text: "Confirm", callback_data: "confirmRegisterCompanyGM"}],
        ]
    }
}
export const registerStartupConfirmLGMKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editStartupRegistringLGM"}, {text: "Confirm", callback_data: "confirmRegisteringStartupLGM"}],
            
        ]
    }
}
export const registerStartupConfirmUGMKeyboard = {
       parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editStartupRegistringUGM"}, {text: "Confirm", callback_data: "confirmRegisteringStartupUGM"}],
            
        ]
    } 
}
export const registerStartupConfirmLRKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editStartupRegistringLR"}, {text: "Confirm", callback_data: "confirmRegisteringStartupLR"}],
            
        ]
    }
}
export const registerStartupConfirmURKeyboard = {
       parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editStartupRegistringUR"}, {text: "Confirm", callback_data: "confirmRegisteringStartupUR"}],
            
        ]
    } 
}

export const listOfCompanyRegisterdKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Company #1", callback_data: "c11"}, {text: "Company #2", callback_data: "c22"}],
          [{text: "Company #3", callback_data: "c33"}, {text: "Company #4", callback_data: "c44"}],
          [{text: "Company #5", callback_data: "c55"}, {text: "Company #6", callback_data: "c66"}],
        ],resize_keyboard: true, one_time_keyboard: true,
    }
}
export const registerCompanyToBeEditFieldRKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "Name of Company"}, {text: "Employee Size", callback_data: "Employee size of company"}],
          [{text: "Email", callback_data: "Company email"}, {text: "Phone No", callback_data: "Company phone number"}],
          [{text: "Address", callback_data: "Company location"}, {text: "Website", callback_data: "Company website"}],
        ]
    }
}
export const registerCompanyToBeEditFieldGMKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "Name of-Company"}, {text: "Employee Size", callback_data: "EmployeeSize -of-Company"}],
          [{text: "Email", callback_data: "Email of-Company"}, {text: "Phone No", callback_data: "PhoneNumber of-Company"}],
          [{text: "Location", callback_data: "Location of-Company"}, {text: "Website", callback_data: "Website of-Company"}],
        ]
    }
}
export const registerStartupToBeEditFieldLGMKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "name_of_startupLGM"}, {text: "Founder Name 1", callback_data: "foundername1_of_startupLGM"}],
          [{text: "Founder Name 2", callback_data: "foundername2_of_startupLGM"}, {text: "Founder Name 3", callback_data: "foundername3_of_startupLGM"}],
          [{text: "Founder Name 4", callback_data: "foundername4_of_startupLGM"}, {text: "Founder Name 5", callback_data: "foundername5_of_startupLGM"}],
          [{text: "Employee Size", callback_data: "employee_Size_of_startupLGM"}, {text: "Sector", callback_data: "sector_of_startupLGM"}],
          [{text: "Facebook Link", callback_data: "facebook_link_of_startupLGM"}, {text: "Telegram Link", callback_data: "telegram_link_of_startupLGM"}],
          [{text: "YouTube Link", callback_data: "youtube_link_of_startupLGM"}, {text: "TikTok Link", callback_data: "tiktok_link_of_startupLGM"}], 
          [{text: "TwitterLink", callback_data: "twitter_link_of_startupLGM"}, {text: "LinkedIn Link", callback_data: "linkedin_link_of_startupLGM"}],
          [{text: "Other Link 1", callback_data: "other_link1_of_startupLGM"}, {text: "Other Link 2", callback_data: "other_link2_of_startupLGM"}],
          [{text: "Other LInk 3", callback_data: "other_link3_of_startupLGM"}, {text: "Email", callback_data: "email_of_startupLGM"}], 
          [{text: "Phone No", callback_data: "phone_no_of_startupLGM"}, {text: "Website", callback_data: "website_of_startupLGM"}],
          [{text: "Location", callback_data: "location_of_startupLGM"}],
        ]
    }
}
export const registerStartupToBeEditFieldUGMKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "name_of_startupUGM"}, {text: "Founder Name 1", callback_data: "foundername1_of_startupUGM"}],
          [{text: "Founder Name 2", callback_data: "foundername2_of_startupUGM"}, {text: "Founder Name 3", callback_data: "foundername3_of_startupUGM"}],
          [{text: "Founder Name 4", callback_data: "foundername4_of_startupUGM"}, {text: "Founder Name 5", callback_data: "foundername5_of_startupUGM"}],
          [{text: "Employee Size", callback_data: "employee_Size_of_startupUGM"}, {text: "Sector", callback_data: "sector_of_startupUGM"}],
          [{text: "Facebook Link", callback_data: "facebook_link_of_startupUGM"}, {text: "Telegram Link", callback_data: "telegram_link_of_startupUGM"}],
          [{text: "YouTube Link", callback_data: "youtube_link_of_startupUGM"}, {text: "TikTok Link", callback_data: "tiktok_link_of_startupUGM"}], 
          [{text: "TwitterLink", callback_data: "twitter_link_of_startupUGM"}, {text: "LinkedIn Link", callback_data: "linkedin_link_of_startupUGM"}],
          [{text: "Other Link 1", callback_data: "other_link1_of_startupUGM"}, {text: "Other Link 2", callback_data: "other_link2_of_startupUGM"}],
          [{text: "Other LInk 3", callback_data: "other_link3_of_startupUGM"}, {text: "Email", callback_data: "email_of_startupUGM"}], 
          [{text: "Phone No", callback_data: "phone_no_of_startupUGM"}, {text: "Website", callback_data: "website_of_startupUGM"}],
          [{text: "Location", callback_data: "location_of_startupUGM"}],
        ]
    }
}
export const registerStartupToBeEditFieldLRKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "name_of_startupLR"}, {text: "Founder Name 1", callback_data: "foundername1_of_startupLR"}],
          [{text: "Founder Name 2", callback_data: "foundername2_of_startupLR"}, {text: "Founder Name 3", callback_data: "foundername3_of_startupLR"}],
          [{text: "Founder Name 4", callback_data: "foundername4_of_startupLR"}, {text: "Founder Name 5", callback_data: "foundername5_of_startupLR"}],
          [{text: "Employee Size", callback_data: "employee_Size_of_startupLR"}, {text: "Sector", callback_data: "sector_of_startupLR"}],
          [{text: "Facebook Link", callback_data: "facebook_link_of_startupLR"}, {text: "Telegram Link", callback_data: "telegram_link_of_startupLR"}],
          [{text: "YouTube Link", callback_data: "youtube_link_of_startupLR"}, {text: "TikTok Link", callback_data: "tiktok_link_of_startupLR"}], 
          [{text: "TwitterLink", callback_data: "twitter_link_of_startupLR"}, {text: "LinkedIn Link", callback_data: "linkedin_link_of_startupLR"}],
          [{text: "Other Link 1", callback_data: "other_link1_of_startupLR"}, {text: "Other Link 2", callback_data: "other_link2_of_startupLR"}],
          [{text: "Other LInk 3", callback_data: "other_link3_of_startupLR"}, {text: "Email", callback_data: "email_of_startupLR"}], 
          [{text: "Phone No", callback_data: "phone_no_of_startupLR"}, {text: "Website", callback_data: "website_of_startupLR"}],
          [{text: "Location", callback_data: "location_of_startupLR"}],
        ]
    }
}
export const registerStartupToBeEditFieldURKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "name_of_startupUR"}, {text: "Founder Name 1", callback_data: "foundername1_of_startupUR"}],
          [{text: "Founder Name 2", callback_data: "foundername2_of_startupUR"}, {text: "Founder Name 3", callback_data: "foundername3_of_startupUR"}],
          [{text: "Founder Name 4", callback_data: "foundername4_of_startupUR"}, {text: "Founder Name 5", callback_data: "foundername5_of_startupUR"}],
          [{text: "Employee Size", callback_data: "employee_Size_of_startupUR"}, {text: "Sector", callback_data: "sector_of_startupUR"}],
          [{text: "Facebook Link", callback_data: "facebook_link_of_startupUR"}, {text: "Telegram Link", callback_data: "telegram_link_of_startupUR"}],
          [{text: "YouTube Link", callback_data: "youtube_link_of_startupUR"}, {text: "TikTok Link", callback_data: "tiktok_link_of_startupUR"}], 
          [{text: "TwitterLink", callback_data: "twitter_link_of_startupUR"}, {text: "LinkedIn Link", callback_data: "linkedin_link_of_startupUR"}],
          [{text: "Other Link 1", callback_data: "other_link1_of_startupUR"}, {text: "Other Link 2", callback_data: "other_link2_of_startupUR"}],
          [{text: "Other LInk 3", callback_data: "other_link3_of_startupUR"}, {text: "Email", callback_data: "email_of_startupUR"}], 
          [{text: "Phone No", callback_data: "phone_no_of_startupUR"}, {text: "Website", callback_data: "website_of_startupUR"}],
          [{text: "Location", callback_data: "location_of_startupUR"}],
        ]
    }
}
export const starupStatusKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [{text: "Licensed", callback_data:"LicensedStarup"}, {text: "Unlicensed", callback_data: "UnlicensedStartup"}],
        ]
    }
}
export const starupFounderKeyboard = {
    reply_markup: {
      keyboard:[[{text: "Done "}, {text: "Back"}],],resize_keyboard: true, one_time_keyboard: true,
    }
  }