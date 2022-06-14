import {
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

