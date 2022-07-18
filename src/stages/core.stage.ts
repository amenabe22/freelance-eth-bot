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
    companyRegistrationREditScene,
    socialMediaLinkCRScene,
    socialMediaLinkDoneCRScene,
    socialMediaLinkCGMScene,
    socialMediaLinkDoneCGMScene
} from "../scenes/company.registration.scene"
import {
    startupRegistrationLGMscene,
    startupRegistrationLRscene,
    handOverStartupScene,
    startupEditSpecificFieldScene,
    startupRegisteringEditLGMScene,
    startupRegisteringEditLRScene,
    socialMediaLinkLGMScene,
    socialMediaLinkDoneLGMScene,
    socialMediaLinkLRScene,
    socialMediaLinkDoneLRScene,
    startupRegistrationUscene,
    startupRegisteringEditUScene,
    socialMediaLinkUScene,
    socialMediaLinkDoneUScene
} from "../scenes/startup.registration.scene"
import { Scenes } from "telegraf"
import { editJobPostScene, postAJobScene, reviewEmployeeScene } from "../scenes/jobpost.scene"
import { uploadCvScene } from "../scenes/uploadCv.scene"
import { editApplyingScene, jobApplicationScene } from "../scenes/application.scene"
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
        startupRegistrationUscene,
        startupRegistrationLRscene,
        companyRegistrationRScene,
        socialMediaLinkCRScene,
        socialMediaLinkDoneCRScene,
        socialMediaLinkCGMScene,
        socialMediaLinkDoneCGMScene,
        editProfileRegistrationScene,
        companyRegistrationEditScene,
        companyRegistrationREditScene,
        handOverCompanyScene,
        handOverStartupScene,
        companyEditSpecificFieldScene,
        startupEditSpecificFieldScene,
        startupRegisteringEditLGMScene,
        startupRegisteringEditUScene,
        startupRegisteringEditLRScene,
        socialMediaLinkLGMScene,
        socialMediaLinkDoneLGMScene,
        socialMediaLinkUScene,
        socialMediaLinkDoneUScene,
        socialMediaLinkLRScene,
        socialMediaLinkDoneLRScene,
        jobApplicationScene,
        editApplyingScene,
        reviewEmployeeScene,
    ]
)
  