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
  },
  [
    companyRegistraionCancel
  ]
)
export const companyRegistrationREditScene = new CoreScene(
  "companyRegistrationREditScene",
  {
    enter: hdlr.companyEditInitHandler,
    handlers: [
      hdlr.companyEditRValueHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
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
      hdlr.companySocialMediaLinkYesNoGHandler,
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
      hdlr.companySocialMediaLinkYesNoRHandler,
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
export const socialMediaLinkCRScene = new CoreScene(
  "socialMediaLinkCRScene",
  {
    enter: hdlr.companySocialMediaLinkCRInitHandler,
    handlers: [
      hdlr.companySocialMediaLinkCRValueHandler,
      hdlr.companyEmailRHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const socialMediaLinkDoneCRScene = new CoreScene(
  "socialMediaLinkDoneCRScene",
  {
  enter: hdlr.companySocialMediaLinkDoneCRInitHandler,
  handlers: [
    hdlr.companyEmailRHandler,
    hdlr.companyOfficialPhoneNoRHandler,
    hdlr.companyHeadQuarterLocationRHandler,
  ]
  },
  [
  companyRegistraionCancel
  ]
  )

  export const socialMediaLinkCGMScene = new CoreScene(
    "socialMediaLinkCGMScene",
    {
      enter: hdlr.companySocialMediaLinkCGMInitHandler,
      handlers: [
        hdlr.companySocialMediaLinkCGMValueHandler,
        hdlr.companyEmailGHandler
      ]
    },
    [
      companyRegistraionCancel
    ]
  )
  
  export const socialMediaLinkDoneCGMScene = new CoreScene(
    "socialMediaLinkDoneCGMScene",
    {
    enter: hdlr.companySocialMediaLinkDoneCGMInitHandler,
    handlers: [
      hdlr.companyEmailGHandler,
      hdlr.companyOfficialPhoneNoGHandler,
      hdlr.companyHeadQuarterLocationGHandler,
    ]
    },
    [
    companyRegistraionCancel
    ]
    )
    
  