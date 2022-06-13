import {
    AmharicSelectionAction,
    EnglishSelectionAction,
    registerUserHandlerDob,
    registerWithAgeAction
} from "./actions";
import { CoreBot } from "./bot";
import { BOT_TOKEN } from "./constants";
import { coreStage } from "./stages/registration.stage";
import { StartCommand } from "./commands"
import { menuJobseekerSelection, personalizedJobSelection } from "./handlers/callbacks";

export const bot = new CoreBot(
    BOT_TOKEN,
    // register middlewares and stages
    [
        coreStage.middleware(),
    ],
    // register actions
    [
        registerWithAgeAction,
        registerUserHandlerDob,
        AmharicSelectionAction,
        EnglishSelectionAction
    ],
    // register commands
    [
        StartCommand
    ],
    // register core callbacks 
    [
        menuJobseekerSelection,
        personalizedJobSelection
    ]
);