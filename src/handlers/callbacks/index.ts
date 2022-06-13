
import {
    newCustomerRegistrationCancelHandler,
    registerJobSeekerCancelHandler,
} from './callbacks'
import {
    menuJobseekerSelectionHandler,
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

export const registerJobSeekerCancel = {
    key: "Back",
    handler: registerJobSeekerCancelHandler
}

// handler for main menu personalize selector
export const personalizedJobSelection = {
    key: "Personalized Jobs",
    handler: personalizedJobSelectionHandler
}