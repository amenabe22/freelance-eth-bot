
import { newCustomerRegistrationCancelHandler, registerJobSeekerCancelHandler } from './callbacks'
import { menuJobseekerSelectionHandler } from "./core"

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