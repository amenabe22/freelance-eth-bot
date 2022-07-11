import { CoreScene } from "./scene";
import * as hdlr from "../handlers"
import { jobAppCancelButton } from "../handlers/callbacks";

export const jobApplicationScene = new CoreScene(
    "jobApplicationScene",
    {
        enter: hdlr.jobAppInitHandler,
        handlers: [
            hdlr.jobAppNoteHandler,
        ]
    },
    [
        jobAppCancelButton
    ],
)
