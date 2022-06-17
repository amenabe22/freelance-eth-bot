
import { jobPostCancelButtonHandler, postJobMenuSelectionHandler } from '../jobpost'
import { handleCvUploadSelectionHandler } from '../personalization'
import { editRegistrationInfoCallbackHandler } from '../registration'
import {
    newCustomerRegistrationCancelHandler,
    registerJobSeekerCancelHandler,
    companyRegistraionCancelHandler
} from './callbacks'
import {
    companyStartupHandler,
    companyHandler,
    startupHandler,
    employerMenuSelectionHandler,
    menuAccountSelectorHandler,
    menuAmharicSelectorHandler,
    menuEnglishSelectorHandler,
    menuJobseekerSelectionHandler,
    menuLanguageSelectorHandler,
    menuMainSelectorHandler,
    menuSettingsSelectorHandler,
    personalizedJobSelectionHandler
} from "./core"
export const companyStartup = {
    key: "My Companies / Startup",
    handler: companyStartupHandler
}
export const company = {
    key: "Company",
    handler: companyHandler
}
export const startup = {
    key: "Startup",
    handler: startupHandler,
}
export const newCustomerRegistrationCancel = {
    key: "Back",
    handler: newCustomerRegistrationCancelHandler
}
export const companyRegistraionCancel = {
    key: "Back",
    handler: companyRegistraionCancelHandler
}
export const menuJobseekerSelection = {
    key: "Job Seeker",
    handler: menuJobseekerSelectionHandler
}

export const menuMainSelector = {
    key: "Main Menu",
    handler: menuMainSelectorHandler
}

export const menuSettingsSelector = {
    key: "Settings",
    handler: menuSettingsSelectorHandler
}

export const menuLanguageSelector = {
    key: "Languages",
    handler: menuLanguageSelectorHandler
}

export const menuEnglishSelector = {
    key: "English",
    handler: menuEnglishSelectorHandler
}

export const menuAmharicSelector = {
    key: "Amharic",
    handler: menuAmharicSelectorHandler
}
export const menuAccountSelector = {
    key: "Account",
    handler: menuAccountSelectorHandler
}

menuAccountSelectorHandler
export const registerJobSeekerCancel = {
    key: "Back",
    handler: registerJobSeekerCancelHandler
}

// handler for main menu personalize selector
export const personalizedJobSelection = {
    key: "Personalized Jobs",
    handler: personalizedJobSelectionHandler
}

export const handleCvUploadSelection = {
    key: "Upload CV",
    handler: handleCvUploadSelectionHandler
}

export const employerMenuSelection = {
    key: "Employer",
    handler: employerMenuSelectionHandler
}

export const postJobMenuSelection = {
    key: "Post a Job",
    handler: postJobMenuSelectionHandler
}

export const jobPostCancelButton = {
    key: "Back",
    handler: jobPostCancelButtonHandler
}

