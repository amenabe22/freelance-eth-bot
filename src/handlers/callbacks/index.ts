
import { jobAppCancelButtonHandler, jobPostCancelButtonHandler, postJobMenuSelectionHandler } from '../jobpost'
import { handleCvUploadSelectionHandler } from '../personalization'
import { editRegistrationInfoCallbackHandler } from '../registration'
import {
    newCustomerRegistrationCancelHandler,
    registerJobSeekerCancelHandler,
    companyRegistraionCancelHandler,
    newCustomerRegistrationSkipHandler
} from './callbacks'
import {
    companyStartupHandler,
    companyHandler,
    startupHandler,
    addMoreCompanyHandler,
    employerMenuSelectionHandler,
    menuAccountSelectorHandler,
    menuAmharicSelectorHandler,
    menuEnglishSelectorHandler,
    menuJobseekerSelectionHandler,
    menuLanguageSelectorHandler,
    menuMainSelectorHandler,
    menuSettingsSelectorHandler,
    personalizedJobSelectionHandler,
    addMoreStartupHandler,
    myJobPostsHandler,
    myJobsHandler,
    myJobPostsOpenedJobHandler,
    myJobPostsClosedJobHandler,
    myJobPostsPendingJobHandler,
    myJobPostsDeclinedJobHandler,
    myJobPostsActiveJobHandler,
    myJobPostsDoneJobHandler,
    myJobsActiveJobHandler,
    myJobsDoneJobHandler
} from "./core"
export const companyStartup = {
    key: /^My Companies\/Startups|ድርጅት\/ስታርትአፕ$/,
    handler: companyStartupHandler
}
export const company = {
    key: /^(Company|ድርጅት)$/,
    handler: companyHandler
}
export const startup = {
    key: "Startup",
    handler: startupHandler,
}
export const adMoreCompany = {
    key: /^Add Company|ድርጅት ያስመዝግቡ$/,
    handler: addMoreCompanyHandler
}
export const addMoreStartup = {
    key: "Add Startup",
    handler: addMoreStartupHandler,
}
export const newCustomerRegistrationCancel = {
    key: "Back",
    handler: newCustomerRegistrationCancelHandler
}
export const newCustomerRegistrationSkip = {
    key: "Skip",
    handler: newCustomerRegistrationSkipHandler
}
export const companyRegistraionCancel = {
    key: /^Back|ተመለስ$/,
    handler: companyRegistraionCancelHandler
}
export const menuJobseekerSelection = {
    key: /^(Job Seeker|ስራ ፈላጊ)$/,
    handler: menuJobseekerSelectionHandler
}

export const menuMainSelector = {
    key: "Main Menu",
    handler: menuMainSelectorHandler
}

export const menuSettingsSelector = {
    key: /^(Settings|ሴቲንግ)$/,
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
    key: /^Employeer|አሰሪ$/,
    handler: employerMenuSelectionHandler
}

export const postJobMenuSelection = {
    key: /^Post a Job|ስራ ማስታወቂያ ለማውጣት$/,
    handler: postJobMenuSelectionHandler
}
export const myJobPostsSelection = {
    key: /^My Job Posts|የእስካሁን ስራዎች$/,
    handler: myJobPostsHandler
}
export const myJobPostsOpendJobSelection = {
    key: "Opened",
    handler: myJobPostsOpenedJobHandler
}
export const myJobPostsClosedJobsSelection = {
    key: "Closed",
    handler: myJobPostsClosedJobHandler
}
export const myJobPostsPendigJobsSelection = {
    key: "Pending",
    handler: myJobPostsPendingJobHandler
}
export const myJobPostsDeclinedJobsSelection = {
    key: "Declined",
    handler: myJobPostsDeclinedJobHandler
}
export const myJobPostsActiveJobsSelection = {
    key: "Active",
    handler: myJobPostsActiveJobHandler
}
export const myJobPostsDoneJobsSelection = {
    key: "Done",
    handler: myJobPostsDoneJobHandler
}

export const myJobsSelection = {
    key: "My Jobs",
    handler: myJobsHandler
}
export const myJobsActiveJobsSelection = {
    key: "Active Jobs",
    handler: myJobsActiveJobHandler
}
export const myJobsDoneJobsSelection = {
    key: "Done Jobs",
    handler: myJobsDoneJobHandler
}
export const jobPostCancelButton = {
    key: "Back",
    handler: jobPostCancelButtonHandler
}

export const jobAppCancelButton = {
    key: "Back",
    handler: jobAppCancelButtonHandler
}
