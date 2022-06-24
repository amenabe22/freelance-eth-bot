import {
    ageInputStyleScene,
    editProfileRegistrationScene,
    newCustomerRegistrationScene,
    registerJobSeekerScene
} from "../scenes/registration.scene"
import { companyRegistrationEditScene, 
    companyRegistrationGMScene, 
         companyRegistrationRScene,
         handOverCompanyScene,
         companyEditSpecificFieldScene
        } from "../scenes/company.registration.scene"
import { startupRegistrationLGMscene, 
         startupRegistrationUGMscene,
         startupRegistrationLRscene,
         startupRegistrationURscene,
         handOverStartupScene,
         startupEditSpecificFieldScene,
         startupRegisteringEditLGMScene,
         startupRegisteringEditLRScene,        
      }from "../scenes/startup.registration.scene"
import { Scenes } from "telegraf"
import { postAJobScene } from "../scenes/jobpost.scene"
import { uploadCvScene } from "../scenes/uploadCv.scene"
export const coreStage: any = new Scenes.Stage<any>(
    [
        newCustomerRegistrationScene,
        ageInputStyleScene,
        registerJobSeekerScene,
        postAJobScene,
        uploadCvScene,
        companyRegistrationGMScene,
        startupRegistrationLGMscene,
        startupRegistrationUGMscene,
        startupRegistrationLRscene,
        startupRegistrationURscene,
        companyRegistrationRScene,
        editProfileRegistrationScene,
        companyRegistrationEditScene,
        handOverCompanyScene,
        handOverStartupScene,
        companyEditSpecificFieldScene,
        startupEditSpecificFieldScene,
        startupRegisteringEditLGMScene,
        startupRegisteringEditLRScene,
    ]
)
