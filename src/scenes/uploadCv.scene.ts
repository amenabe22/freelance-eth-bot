import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import  {companyRegistraionCancel}  from "../handlers/callbacks"
export const uploadCvScene = new CoreScene(
    "uploadCvScene",
    {
      // enter handler
      enter: hdlr.uploadCvInitHandler,
      // steps handler
      handlers: [
        hdlr.uploadCvHandler,
      ]
    },
    // middlewares for buttons
    [
        companyRegistraionCancel
    ]
  )