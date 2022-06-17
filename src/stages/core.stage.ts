import {
    ageInputStyleScene,
    editProfileRegistrationScene,
    newCustomerRegistrationScene,
    registerJobSeekerScene
} from "../scenes/registration.scene"
import { companyRegistrationGMScene, 
         companyRegistrationRScene,
        } from "../scenes/company.registration.scene"
import { startupRegistrationLGMscene, 
         startupRegistrationLRscene
        
      }from "../scenes/startup.registration.scene"
import { Scenes } from "telegraf"
import { postAJobScene } from "../scenes/jobpost.scene"

export const coreStage: any = new Scenes.Stage<any>(
    [
        newCustomerRegistrationScene,
        ageInputStyleScene,
        registerJobSeekerScene,
        postAJobScene,
        companyRegistrationGMScene,
        startupRegistrationLGMscene,
        startupRegistrationLRscene,
        companyRegistrationRScene,
        editProfileRegistrationScene
    ]
)
