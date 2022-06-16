import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import  {companyRegistraionCancel}  from "../handlers/callbacks"

export const companyRegistrationGMScene = new CoreScene(
  "companyRegistrationGMScene",
  {
    enter: hdlr.companyNameGHandler,
    handlers: [
      hdlr.companyNameGHandler,
      hdlr.companyTradeLicensePhotoGHandler,
      hdlr.companyIdPhotoGHandler,
      hdlr.companyIndustrySectorGHandler,
      hdlr.companyEmployeeSizeGHandler,
      hdlr.companyWebsiteGHandler,
      hdlr.companyEmailGHandler,
      hdlr.companyOfficialPhoneNoGHandler,
      hdlr.companyHeadQuarterLocationGHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const companyRegistrationRScene = new CoreScene(
  "companyRegistrationRScene",
  {
    enter: null,
    handlers: [
        hdlr.companyNameRHandler,
        hdlr.companyTradeLicensePhotoRHandler,
        hdlr.companyIdPhotoRHandler,
        hdlr.companyIndustrySectorRHandler,
        hdlr.companyEmployeeSizeRHandler,
        hdlr.companyWebsiteRHandler,
        hdlr.companyEmailRHandler,
        hdlr.companyOfficialPhoneNoRHandler,
        hdlr.companyHeadQuarterLocationRHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
)