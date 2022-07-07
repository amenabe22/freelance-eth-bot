import { CoreScene } from "./scene";
import * as hdlr from "../handlers"
import { jobPostCancelButton } from "../handlers/callbacks";

export const postAJobScene = new CoreScene(
    "postAJobScene",
    {
        enter: hdlr.postAJobInitHandler,
        handlers: [
            hdlr.postAJobNameHandler,
            hdlr.postAJobDescriptionHandler,
            hdlr.postAJobTypeHandler,
            hdlr.postAjobSectorHandler,
            hdlr.postAJobSalaryHandler,
            hdlr.postAJobWorkingLocationHandler,
            hdlr.postAjobApplicantNeededHandler,
            hdlr.postAJobVacancyHandler
        ]
    },
    [
        jobPostCancelButton
    ],
)
export const editJobPostScene = new CoreScene(
    "editJobPostScene",
    {
        enter: hdlr.editPostAJobInitHandler,
        handlers: [
            hdlr.editpostAJobValueHandler,
         
        ]
    },
    [
        jobPostCancelButton
    ],
    )