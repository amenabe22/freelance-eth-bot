import {
    ageInputStyleScene,
    newCustomerRegistrationScene,
    registerJobSeekerScene
} from "../scenes/registration.scene"
import { Scenes } from "telegraf"
import { postAJobScene } from "../scenes/jobpost.scene"

export const coreStage: any = new Scenes.Stage<any>(
    [
        newCustomerRegistrationScene,
        ageInputStyleScene,
        registerJobSeekerScene,
        postAJobScene
    ]
)
