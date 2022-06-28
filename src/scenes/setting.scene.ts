import { CoreScene } from "./scene";
import * as hdlr from "../handlers"
import { editProfileCancel } from "../handlers/callbacks";
// import { jobPostCancelButton } from "../handlers/callbacks";

export const editProfileScene = new CoreScene(
    "editProfileScene",
    {
        enter: hdlr.settingsSceneInitHandler,
        handlers: [
            hdlr.editProfileHandler
        ]
    },
    [
        editProfileCancel
    ],

)