<<<<<<< HEAD
import {
    AmharicSelectionAction,
    confirmEditProfileAction,
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
=======
import * as act from "./actions"

>>>>>>> bc069cdd911ccacf84e0d9c7c068a7046a2e2c62
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
<<<<<<< HEAD
        RegisterWithAgeAction,
        RegisterUserHandlerDob,
        AmharicSelectionAction,
        EnglishSelectionAction,
        SectorSelectionAction,
        jobPostCompanyAction,
        EditProfileAction,
        jobPostCompanySelectorAction,
        EditMultipleProfileAction,
        confirmEditProfileAction
=======
        act.RegisterCompanyGMAction,
        act.RegisterCompanyRAction,
        act.CompanyHandOverAction,
        act.StartupHandOverAction,
        act.CompanyEditAction,
        act.StartupEditAction,
        act.CompanyEditFieldAction,
        act.startupEditFieldAction,
        act.StartupSelectionAction,
        act.LicensedStartupAction,
        act.CompanySelectionAction,
        act.UnlicensedStartupAction,
        act.RegisterStartupLGMAction,
        act.RegisterStartupUGMAction, 
        act.RegisterStartupLRAction,
        act.RegisterStartupURAction,
        act.confirmRegisteringStartupLGMAction,
        act.confirmRegisteringStartupUGMAction,
        act.confirmRegisteringStartupLRAction,
        act.confirmRegisteringStartupURAction,
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
        act.editCompanyRegistrationCbAction,
        act.editCompanyRegistringGMAction,
        act.editStartupRegisteringLGMAction,
        act.editStartupRegisteringUGMAction,
        act.editStartupRegisteringLRAction,
        act.editStartupRegisteringURAction,
        act.editStartupRegisteringLGMInitAction,
        act.editStartupRegisteringUGMInitAction,
        act.editStartupRegisteringLRInitAction,
        act.editStartupRegisteringURInitAction,
        act.editCompanyRegistrationRCbAction
        
>>>>>>> bc069cdd911ccacf84e0d9c7c068a7046a2e2c62
    ],
    // register commands
    [ 
        StartCommand
    ],
    // register core callbacks  
    [
<<<<<<< HEAD
        menuJobseekerSelection,
        personalizedJobSelection,
        menuMainSelector,
        menuSettingsSelector,
        menuLanguageSelector,
        menuEnglishSelector,
        menuAmharicSelector,
        menuAccountSelector,
        TermsAndConditionsAction,
        handleCvUploadSelection,
        employerMenuSelection,
        postJobMenuSelection
    ]
=======
        cb.companyStartup,
        cb.company,
        cb.startup,
        cb.adMoreCompany,
        cb.addMoreStartup,
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
>>>>>>> bc069cdd911ccacf84e0d9c7c068a7046a2e2c62
);

