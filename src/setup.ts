import * as act from "./actions"

import { CoreBot } from "./bot";
import { BOT_TOKEN } from "./constants";
import { coreStage } from "./stages/core.stage";
import { StartCommand } from "./commands"
import * as cb from "./handlers/callbacks"

export const bot = new CoreBot(
    BOT_TOKEN,
    // register middlewares and stages
    [
        coreStage.middleware(),
    ],
    // register actions
    [
        act.RegisterCompanyGMAction,
        act.RegisterCompanyRAction,
        act.LicensedStartupAction,
        act.UnlicensedStartupAction,
        act.RegisterStartupLGMAction,
        act.RegisterStartupUGMAction,
        act.RegisterStartupLRAction,
        act.RegisterStartupURAction,
        act.confirmRegisteringStartupLGMAction,
        act.confirmRegisteringStartupUGMAction,
        act.confirmRegisteringStartupLRAction,
        act.confirmRegisteringStartupURAction,
        act.editRegisteringStartupLGMAction,
        act.editRegisteringStartupUGMAction,
        act.editRegisteringStartupLRAction,
        act.editRegisteringStartupURAction,
        act.RegisterWithAgeAction,
        act.RegisterUserHandlerDob,
        act.AmharicSelectionAction,
        act.EnglishSelectionAction,
        act.SectorSelectionAction,
        act.jobPostCompanyAction,
        act.EditProfileAction,
        act.jobPostCompanySelectorAction,
        act.editRegisterWithAgeUserAction,
        act.editRegistrationInfoAction,
        act.confirmRegisterCompanyAction,
        act.confirmRegisterCompanyGMAction,
        act.editCompanyRegistringAction,
        act.editCompanyRegistrationCbAction
    ],
    // register commands
    [
        StartCommand
    ],
    // register core callbacks 
    [
        cb.companyStartup,
        cb.company,
        cb.startup,
        cb.menuJobseekerSelection,
        cb.personalizedJobSelection,
        cb.menuMainSelector,
        cb.menuSettingsSelector,
        cb.menuLanguageSelector,
        cb.menuEnglishSelector,
        cb.menuAmharicSelector,
        cb.menuAccountSelector,
        act.EditMultipleProfileAction,
        act.TermsAndConditionsAction,
        cb.handleCvUploadSelection,
        cb.employerMenuSelection,
        cb.postJobMenuSelection
    ]
);

