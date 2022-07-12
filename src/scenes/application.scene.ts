import { CoreScene } from "./scene";
import * as hdlr from "../handlers"
import { jobAppCancelButton } from "../handlers/callbacks";

export const jobApplicationScene = new CoreScene(
    "jobApplicationScene",
    {
        enter: hdlr.jobAppInitHandler,
        handlers: [
            hdlr.jobAppNoteHandler,
            hdlr.jobPortfolioLinksHandler
        ]
    },
    [
        jobAppCancelButton
    ],
)

export const editApplyingScene = new CoreScene(
    "editApplyingScene",
    {
        enter: hdlr.editApplyJobInitHandler,
        handlers: [
            hdlr.editApplyJobValueHandler,
        ]
    },
    [
        jobAppCancelButton
    ],
)
