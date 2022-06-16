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
export const RegisterWithAgeAction = {
    key: "RegisterWithAgeUser",
    handler: hdlr.ageRegistrationHandlder
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
    key: ["er_first.name", "er_last.name", "er_email", "er_gender", "er_age"],
    handler: editRegistrationInfoCallbackHandler
}
