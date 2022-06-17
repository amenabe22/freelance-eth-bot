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
            [{text: "Edit", callback_data: "editStartupRegistringLGM"}, {text: "Confirm", callback_data: "confirmRegisterStartupLGM"}],
            
        ]
    }
}
export const registerStartupConfirmRKeyboard = {
       parse_mode: "HTML",
    reply_markup: {
        inline_keyboard:[
            [{text: "Edit", callback_data: "editStartupRegistringLR"}, {text: "Confirm", callback_data: "confirmRegisterStartupLR"}],
            
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
          [{text: "Name", callback_data: "Name of Startup"}, {text: "Employee Size", callback_data: "Employee size of startup"}],
          [{text: "Email", callback_data: "Startup Email"}, {text: "Phone No", callback_data: "Startup phone number"}],
          [{text: "Location", callback_data: "Startup location"}, {text: "Website", callback_data: "Startup website"}],
        ]
    }
}
export const registerStartupToBeEditFieldLRKeyboard = {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
          [{text: "Name", callback_data: "Name of-Startup"}, {text: "Employee Size", callback_data: "EmployeeSize of-startup"}],
          [{text: "Email", callback_data: "Email of_Startup"}, {text: "Phone No", callback_data: "PhoneNo of-Startup"}],
          [{text: "Location", callback_data: "Location of-Startup"}, {text: "Website", callback_data: "Website of-Startup"}],
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