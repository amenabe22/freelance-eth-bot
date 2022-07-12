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
        act.jobPostingConfirmHandler,
        act.jobPostingEditHandler,
        act.jobPostingSelectFieldEditHandler,
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
        act.editCompanyRegistrationRCbAction,
        act.socialMediaAddingLGMInitAction,
        act.socialMediaAddingUGMInitAction,
        act.socialMediaAddingLRInitAction,
        act.socialMediaAddingURInitAction,
        act.editPersonalizationSectorsAction,
        act.editPersonalizationJobTypeAction,
        act.PersonalizationSectSelectorAction,
        act.PersonalizationJtSelectorAction,
        act.jobPostStartupSelectorAction,
        act.jobPostPrivateClientSelectorAction,
        act.jobApplyingConfirmHandlerAction,
        act.jobApplyingEditHandlerAction,
        act.jobApplingSelectFieldHandlerAction


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
        cb.postJobMenuSelection,
        cb.myJobPostsSelection,
        cb.myJobPostsOpendJobSelection,
        cb.myJobPostsClosedJobsSelection,
        cb.myJobPostsPendigJobsSelection,
        cb.myJobPostsDeclinedJobsSelection,
        cb.myJobPostsActiveJobsSelection,
        cb.myJobPostsDoneJobsSelection,
        cb.myJobsSelection,
        cb.myJobsActiveJobsSelection,
        cb.myJobsDoneJobsSelection 
    ]
);

