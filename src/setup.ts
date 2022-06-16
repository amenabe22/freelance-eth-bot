import {
    RegisterCompanyGMAction,
    RegisterCompanyRAction,
    AmharicSelectionAction,
    EditMultipleProfileAction,
    EditProfileAction,
    EnglishSelectionAction,
    jobPostCompanyAction,
    jobPostCompanySelectorAction,
    RegisterUserHandlerDob,
    RegisterWithAgeAction,
    SectorSelectionAction,
    TermsAndConditionsAction
} from "./actions";
import { CoreBot } from "./bot";
import { BOT_TOKEN } from "./constants";
import { coreStage } from "./stages/core.stage";
import { StartCommand } from "./commands"
import {
    companyStartup,
    company,
    employerMenuSelection,
    handleCvUploadSelection,
    menuAccountSelector,
    menuAmharicSelector,
    menuEnglishSelector,
    menuJobseekerSelection,
    menuLanguageSelector,
    menuMainSelector,
    menuSettingsSelector,
    personalizedJobSelection,
    postJobMenuSelection
} from "./handlers/callbacks";

export const bot = new CoreBot(
    BOT_TOKEN,
    // register middlewares and stages
    [
        coreStage.middleware(),
    ],
    // register actions
    [
        RegisterCompanyGMAction,
        RegisterCompanyRAction,
        RegisterWithAgeAction,
        RegisterUserHandlerDob,
        AmharicSelectionAction,
        EnglishSelectionAction,
        SectorSelectionAction,
        jobPostCompanyAction,
        EditProfileAction,
        jobPostCompanySelectorAction
    ],
    // register commands
    [
        StartCommand
    ],
    // register core callbacks 
    [
        companyStartup,
        company,
        menuJobseekerSelection,
        personalizedJobSelection,
        menuMainSelector,
        menuSettingsSelector,
        menuLanguageSelector,
        menuEnglishSelector,
        menuAmharicSelector,
        menuAccountSelector,
        EditMultipleProfileAction,
        TermsAndConditionsAction,
        handleCvUploadSelection,
        employerMenuSelection,
        postJobMenuSelection
    ]
);

