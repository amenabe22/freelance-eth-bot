import {
    ageInputStyleScene,
    newCustomerRegistrationScene,
    registerJobSeekerScene
} from "../scenes/registration.scene"
import { Scenes } from "telegraf"

export const registrationStage: any = new Scenes.Stage<any>(
    [
        newCustomerRegistrationScene,
        ageInputStyleScene
    ]
)


export const mainMenuStage: any = new Scenes.Stage<any>(
    [
        registerJobSeekerScene
    ]
)