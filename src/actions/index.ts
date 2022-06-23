import {
    editMultipleProfileHandler,
    editProfileHandler,
    termsAndConditionsHandler
} from "../handlers/callbacks/core";
import * as hdlr from "../handlers";
import { editRegisterWithAgeUserHandler, editRegistrationInfoCallbackHandler, jobPostCompanyActionHandler, jobPostCompanySelectorActionHandler } from "../handlers";

export const RegisterCompanyGMAction = {
    key: "Genaral Manager",
    handler: hdlr.companyGMSelectionHandler,
}
export const RegisterCompanyRAction = {
    key: "Representative",
    handler: hdlr.companyRSelectionHandler,
}
export const CompanyHandOverAction = {
    key: "hand-over-company",
    handler: hdlr.companyHandOverHandler
}
export const StartupHandOverAction = {
    key: "hand-over-startup",
    handler: hdlr.startupHandOverHandler
}
export const CompanyEditAction = {
    key: "edit-company",
    handler: hdlr.companyEditHandler
}
export const StartupEditAction = {
    key: "edit-startup",
    handler: hdlr.startupEditHandler,
}
export const CompanyEditFieldAction = {
    key: ["edit_name_of_company", "edit_employee_of_company", "edit_email_of_company", "edit_phone_of_company", "edit_location_of_company", "edit_websit_of_company"],
    handler: hdlr.comanyEditFieldHandler
}
export const startupEditFieldAction = {
    key: ["edit_name_of_startup", "edit_employee_of_startup", "edit_email_of_startup", "edit_phone_of_startup", "edit_location_of_startup", "edit_websit_of_startup", "license_of_startup"],
    handler: hdlr.startupEditFieldHandler
}
export const LicensedStartupAction = {
    key: "LicensedStarup",
    handler: hdlr.startupLicensedActionHandler,
}
export const UnlicensedStartupAction = {
    key: "UnlicensedStartup",
    handler: hdlr.startupUnlicensedActionHandler,
}
export const RegisterStartupLGMAction = {
    key: "StartupLicensedGM",
    handler: hdlr.startupLGMSelectionHandler,
}
export const RegisterStartupUGMAction = {
    key: "StartupUnlicensedGM",
    handler: hdlr.startupUGMSelectionHandler,
}
export const RegisterStartupLRAction = {
    key: "StartupLicensedR",
    handler: hdlr.startupLRSelectionHandler,
}
export const RegisterStartupURAction = {
    key: "StartupUnlicensedR",
    handler: hdlr.startupURSelectionHandler,
}
export const RegisterWithAgeAction = {
    key: "RegisterWithAgeUser",
    handler: hdlr.ageRegistrationHandlder
}
export const confirmRegisteringStartupLGMAction = {
    key: "confirmRegisteringStartupLGM",
    handler: hdlr.confirmRegisterStartUpLGMHandler
}
export const confirmRegisteringStartupUGMAction = {
    key: "confirmRegisteringStartupUGM",
    handler: hdlr.confirmRegisterStartUpUGMHandler
}
export const confirmRegisterCompanyAction = {
    key: "confirmRegisterCompany",
    handler: hdlr.confirmRegisterCompanyActionHandler
}

export const confirmRegisterCompanyGMAction = {
    key: "confirmRegisterCompanyGM",
    handler: hdlr.confirmRegisterCompanyGMActionHanlder
}
export const confirmRegisteringStartupLRAction = {
    key: "confirmRegisteringStartupLR",
    handler: hdlr.confirmRegisterStartUpLRHandler
}
export const confirmRegisteringStartupURAction = {
    key: "confirmRegisteringStartupUR",
    handler: hdlr.confirmRegisterStartUpURHandler
}
export const editRegisteringStartupLGMAction = {
    key: "editStartupRegistringLGM",
    handler: hdlr.editRegisterStartUpLGMHandler
}
export const editRegisteringStartupUGMAction = {
    key: "editStartupRegistringUGM",
    handler: hdlr.editRegisterStartUpUGMHandler
}
export const editRegisteringStartupLRAction = {
    key: "editStartupRegistringLR",
    handler: hdlr.editRegisterStartUpLRHandler
}
export const editRegisteringStartupURAction = {
    key: "editStartupRegistringLGM",
    handler: hdlr.editRegisterStartUpURHandler
}

export const RegisterUserHandlerDob = {
    key: "RegisterUser",
    handler: hdlr.registerUserHandler
}

export const AmharicSelectionAction = {
    key: "Amharic",
    handler: hdlr.amharicSelectionHandler
}

export const EnglishSelectionAction = {
    key: "English",
    handler: hdlr.englishSelectionHandler
}

// listen for 0-20 in the callback data
export const SectorSelectionAction = {
    key: /\b(0?[0-9]|1[0-9]|2[0-0])\b/g,
    handler: hdlr.sectorSelectionActionHandler
}
//listen for 30 - 40 in the callback data for list of companies
export const CompanySelectionAction = {
    key: /\b(3?[0-9]|4[0-9]|5[0-0])\b/g,
    handler: hdlr.companySelectionActionHandler
}
export const StartupSelectionAction = {
    key: /\b(6?[0-9]|7[0-9]|8[0-0])\b/g,
    handler: hdlr.startupSelectionActionHandler
}
export const EditProfileAction = {
    key: "EditProfile",
    handler: editProfileHandler
}

export const EditMultipleProfileAction = {
    key: ["edit-Name", "edit-Education Level", "edit-Email", "edit-Birth date", "edit-Availability", "edit-Gender"],
    handler: editMultipleProfileHandler
}

export const TermsAndConditionsAction = {
    key: "Terms and Conditions",
    handler: termsAndConditionsHandler
}

export const jobPostCompanyAction = {
    key: "jobPostCompany",
    handler: jobPostCompanyActionHandler
}


export const jobPostCompanySelectorAction = {
    key: ["c1", "c2", "c3", "c4", "c5", "c6", "jobPostStartup", "jobPostPrivateClient"],
    handler: jobPostCompanySelectorActionHandler
}

export const editRegisterWithAgeUserAction = {
    key: "editRegisterWithAgeUser",
    handler: editRegisterWithAgeUserHandler
}

export const editRegistrationInfoAction = {
    key: ["er_first.name", "er_last.name", "er_email", "er_gender", "er_age", "er_residence"],
    handler: editRegistrationInfoCallbackHandler
}

export const editCompanyRegistrationCbAction = {
    key: ["edc.name", "edc.sector", "edc.phone", "edc.website", "edc.email", "edc.hqs"],
    handler: hdlr.editCompanyRegistrationCbActionHandler
}

export const editCompanyRegistrationRCbAction = {
    key: ["edr.name", "edr.sector", "edr.phone", "edr.website", "edr.email", "edr.hqs"],
    handler: hdlr.editCompanyRegistrationRCbActionHandler
}
export const editCompanyRegistringAction = {
    key: "editCompanyRegistring",
    handler: hdlr.editCompanyRegistringHandler
}
export const editCompanyRegistringGMAction = {
    key: "editCompanyRegistringGM",
    handler: hdlr.editCompanyRegistringGMHandler
}