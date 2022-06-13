import {
    AmharicSelectionAction,
    EditMultipleProfileAction,
    EditProfileAction,
    EnglishSelectionAction,
    RegisterUserHandlerDob,
    RegisterWithAgeAction,
    SectorSelectionAction,
    TermsAndConditionsAction
} from "./actions";
import { CoreBot } from "./bot";
import { BOT_TOKEN } from "./constants";
import { coreStage } from "./stages/registration.stage";
import { StartCommand } from "./commands"
import {
    menuAccountSelector,
    menuAmharicSelector,
    menuEnglishSelector,
    menuJobseekerSelection,
    menuLanguageSelector,
    menuMainSelector,
    menuSettingsSelector,
    personalizedJobSelection
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
        EditProfileAction,
        EditMultipleProfileAction,
        TermsAndConditionsAction
    ]
);