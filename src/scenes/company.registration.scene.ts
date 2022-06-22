import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import { companyRegistraionCancel } from "../handlers/callbacks"
import { companyEditSpecificFieldInitHandler, handOverCompanyInitHandler } from "../handlers"

export const companyRegistrationEditScene = new CoreScene(
  "companyRegistrationEditScene",
  {
    enter: hdlr.companyEditInitHandler,
    handlers: [
      hdlr.companyEditValueHandler,
    ]
  }
)

export const companyRegistrationGMScene = new CoreScene(
  "companyRegistrationGMScene",
  {
    enter: hdlr.companyGInitHandler,
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
    enter: hdlr.companyRInitHandler,
    handlers: [
      hdlr.companyNameRHandler,
      hdlr.companyTradeLicensePhotoRHandler,
      hdlr.companyIdPhotoRHandler,
      hdlr.companyStampedLetterPhotoRHandler,
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

export const companyEditSpecificFieldScene = new CoreScene(
  "companyEditSpecificFieldScene",
  {
    enter: companyEditSpecificFieldInitHandler,
    handlers: [
      hdlr.companyEditSpecificFieldInputHandler,
      hdlr.companyEditSpecificFieldSumitHandler
    ]
  }, [
  companyRegistraionCancel
]
)

export const handOverCompanyScene = new CoreScene(
  "handOverCompanyScene",
  {
    enter: handOverCompanyInitHandler,
    handlers: [
      hdlr.handOverCompanyPhoneHandler,
      hdlr.handOverComapanyYesNoHandler

    ]
  },
  [
    companyRegistraionCancel
  ]
)