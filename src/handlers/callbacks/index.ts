
import {
    newCustomerRegistrationCancelHandler,
    registerJobSeekerCancelHandler,
} from './callbacks'
import {
    menuAccountSelectorHandler,
    menuAmharicSelectorHandler,
    menuEnglishSelectorHandler,
    menuJobseekerSelectionHandler,
    menuLanguageSelectorHandler,
    menuMainSelectorHandler,
    menuSettingsSelectorHandler,
    personalizedJobSelectionHandler
} from "./core"

export const newCustomerRegistrationCancel = {
    key: "Back",
    handler: newCustomerRegistrationCancelHandler
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