import {
    editMultipleProfileHandler,
    editPersonalizationJobTypeActionHandler,
    editPersonalizationSectorsActionHandler,
    editProfileHandler,
    termsAndConditionsHandler
} from "../handlers/callbacks/core";
import * as hdlr from "../handlers";
import { editRegisterWithAgeUserHandler, editRegistrationInfoCallbackHandler } from "../handlers";

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
//listen for 30 - 50 in the callback data for list of companies
export const CompanySelectionAction = {
    key: /\b(3?[0-9]|4[0-9]|5[0-0])\b/g,
    handler: hdlr.companySelectionActionHandler
}

export const PersonalizationJtSelectorAction = {
    key: /^per_jt_*.*$/,
    handler: hdlr.PersonalizationJtSelectorActionHandler
}

export const PersonalizationSectSelectorAction = {
    key: /^per_sect_*.*$/,
    handler: hdlr.personalizedSectSectorActionHandler
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

export const editPersonalizationSectorsAction = {
    key: "editPersonalizationSectors",
    handler: editPersonalizationSectorsActionHandler
}

export const editPersonalizationJobTypeAction = {
    key: "editPersonalizationJobType",
    handler: editPersonalizationJobTypeActionHandler
}

export const editCompanyRegistringAction = {
    key: "editCompanyRegistring",
    handler: hdlr.editCompanyRegistringHandler
}
export const editCompanyRegistringGMAction = {
    key: "editCompanyRegistringGM",
    handler: hdlr.editCompanyRegistringGMHandler
}

export const editStartupRegisteringLGMAction = {
    key: "editStartupRegistringLGM",
    handler: hdlr.editRegisterStartupLGMHandler
}
export const editStartupRegisteringUGMAction = {
    key: "editStartupRegistringUGM",
    handler: hdlr.editRegisterStartupUHandler
}
export const editStartupRegisteringLRAction = {
    key: "editStartupRegistringLR",
    handler: hdlr.editRegisterStartupLRHandler
}
export const editStartupRegisteringLGMInitAction = {
    key: ["name.LGM", "founderN1.LGM", "founderN2.LGM", "founderN3.LGM", "founderN5.LGM", "employee.LGM", "sector.LGM", "facebook.LGM", "telegram.LGM", "youtube.LGM", "tiktok.startupLGM", "twitter.LGM", "linkedin.LGM", "other1.LGM ", "other2.LGM", "other3.LGM", "email.LGM", "phone.LGM", "website.LGM", "location.LGM","done.LGM"],
    handler: hdlr.editRegisterStartupLGMCbActionHandler
}
export const editStartupRegisteringUGMInitAction = {
    key: ["name.UGM", "founderN1.UGM", "founderN2.UGM", "founderN3.UGM", "founderN5.UGM", "employee.UGM", "sector.UGM", "facebook.UGM", "telegram.UGM", "youtube.UGM", "tiktok.startupUGM", "twitter.UGM", "linkedin.UGM", "other1.UGM ", "other2.UGM", "other3.UGM", "email.UGM", "phone.UGM", "website.UGM", "location.UGM","done.UGM"],
    handler: hdlr.editRegisterStartupUCbActionHandler 
}
export const editStartupRegisteringLRInitAction = {
    key: ["name.LR", "founderN1.LR", "founderN2.LR", "founderN3.LR", "founderN5.LR", "employee.LR", "sector.LR", "facebook.LR", "telegram.LR", "youtube.LR", "tiktok.startupLR", "twitter.LR", "linkedin.LR", "other1.LR ", "other2.LR", "other3.LR", "email.LR", "phone.LR", "website.LR", "location.LR"],
    handler: hdlr.editRegisterStartupLRCbActionHandler
}

export const socialMediaAddingLGMInitAction = {
    key: ["facebook-linkLGM", "telegram-linkLGM", "youtube-linkLGM", "tiktok-linkLGM", "twitter-linkLGM", "linkedin-linkLGM", "otherlink1-linkLGM", "otherlink2-linkLGM", "otherlink3-linkLGM", "done-linkLGM"],
    handler: hdlr.socialMediaAddingActionLGMHandler             
}
export const socialMediaAddingUGMInitAction = {
    key: ["facebook-linkUGM", "telegram-linkUGM", "youtube-linkUGM", "tiktok-linkUGM", "twitter-linkUGM", "linkedin-linkUGM", "otherlink1-linkUGM", "otherlink2-linkUGM", "otherlink3-linkUGM", "done-linkUGM"],
    handler: hdlr.socialMediaAddingActionUHandler
}
export const socialMediaAddingLRInitAction = {
    key: ["facebook-linkLR", "telegram-linkLR", "youtube-linkLR", "tiktok-linkLR", "twitter-linkLR", "linkedin-linkLR", "otherlink1-linkLR", "otherlink2-linkLR", "otherlink3-linkLR", "done-linkLR"],
    handler: hdlr.socialMediaAddingActionLRHandler
}

export const socialMediaAddingCRInitAction = {
    key: ["facebook-linkCR", "telegram-linkCR", "youtube-linkCR", "tiktok-linkCR", "twitter-linkCR", "linkedin-linkCR", "otherlink1-linkCR", "otherlink2-linkCR", "otherlink3-linkCR", "done-linkCR"],
    handler: hdlr.socialMediaAddingActionCRHandler
}
export const socialMediaAddingCGMInitAction = {
    key: ["facebook-linkCGM", "telegram-linkCGM", "youtube-linkCGM", "tiktok-linkCGM", "twitter-linkCGM", "linkedin-linkCGM", "otherlink1-linkCGM", "otherlink2-linkCGM", "otherlink3-linkCGM", "done-linkCGM"],
    handler: hdlr.socialMediaAddingActionCGMHandler
}
