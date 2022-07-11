import {
    ageInputStyleScene,
    editProfileRegistrationScene,
    newCustomerRegistrationScene,
    registerJobSeekerScene
} from "../scenes/registration.scene"
import {
    companyRegistrationEditScene,
    companyRegistrationGMScene,
    companyRegistrationRScene,
    handOverCompanyScene,
    companyEditSpecificFieldScene,
    companyRegistrationREditScene
} from "../scenes/company.registration.scene"
import {
    startupRegistrationLGMscene,
    startupRegistrationUGMscene,
    startupRegistrationLRscene,
    startupRegistrationURscene,
    handOverStartupScene,
    startupEditSpecificFieldScene,
    startupRegisteringEditLGMScene,
    startupRegisteringEditLRScene,
    startupRegisteringEditUGMScene,
    startupRegisteringEditURScene,
    socialMediaLinkLGMScene,
    socialMediaLinkDoneLGMScene,
    socialMediaLinkUGMScene,
    socialMediaLinkDoneUGMScene,
    socialMediaLinkLRScene,
    socialMediaLinkDoneLRScene,
    socialMediaLinkURScene,
    socialMediaLinkDoneURScene
} from "../scenes/startup.registration.scene"
import { Scenes } from "telegraf"
import { editJobPostScene, postAJobScene } from "../scenes/jobpost.scene"
import { uploadCvScene } from "../scenes/uploadCv.scene"
import { jobApplicationScene } from "../scenes/application.scene"
export const coreStage: any = new Scenes.Stage<any>(
    [
        newCustomerRegistrationScene,
        ageInputStyleScene,
        registerJobSeekerScene,
        postAJobScene,
        editJobPostScene,
        uploadCvScene,
        companyRegistrationGMScene,
        startupRegistrationLGMscene,
        startupRegistrationUGMscene,
        startupRegistrationLRscene,
        startupRegistrationURscene,
        companyRegistrationRScene,
        editProfileRegistrationScene,
        companyRegistrationEditScene,
        companyRegistrationREditScene,
        handOverCompanyScene,
        handOverStartupScene,
        companyEditSpecificFieldScene,
        startupEditSpecificFieldScene,
        startupRegisteringEditLGMScene,
        startupRegisteringEditUGMScene,
        startupRegisteringEditLRScene,
        startupRegisteringEditURScene,
        socialMediaLinkLGMScene,
        socialMediaLinkDoneLGMScene,
        socialMediaLinkUGMScene,
        socialMediaLinkDoneUGMScene,
        socialMediaLinkLRScene,
        socialMediaLinkDoneLRScene,
        socialMediaLinkURScene,
        socialMediaLinkDoneURScene,        
        jobApplicationScene
    ]
)
  