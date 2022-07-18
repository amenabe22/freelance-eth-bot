import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import { companyRegistraionCancel } from "../handlers/callbacks"
import { handOverStartupInitHandler, startupEditSpecificFieldInitHandler } from "../handlers"

export const socialMediaLinkLGMScene = new CoreScene(
  "socialMediaLinkLGMScene",
  {
    enter: hdlr.startupSocialMediaLinkLGMInitHandler,
    handlers: [
      hdlr.startupSocialMediaLinkLGMValueHandler,
      hdlr.startupLGMEmailHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)
export const socialMediaLinkDoneLGMScene = new CoreScene(
"socialMediaLinkDoneLGMScene",
{
enter: hdlr.startupSocialMediaLinkDoneLGMInitHandler,
handlers: [
  hdlr.startupLGMEmailHandler,
  hdlr.startupLGMOfficialPhoneNoHandler,
  hdlr.startupLGMHeadQuarterLocationHandler
]
},
[
companyRegistraionCancel
]
)

export const socialMediaLinkUScene = new CoreScene(
  "socialMediaLinkUScene",
  {
    enter: hdlr.startupSocialMediaLinkUInitHandler,
    handlers: [
      hdlr.startupSocialMediaLinkUValueHandler,
      hdlr.startupUEmailHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)
export const socialMediaLinkDoneUScene = new CoreScene(
"socialMediaLinkDoneUScene",
{
enter: hdlr.startupSocialMediaLinkDoneUInitHandler,
handlers: [
  hdlr.startupUEmailHandler,
  hdlr.startupUOfficialPhoneNoHandler,
  hdlr.startupUHeadQuarterLocationHandler
]
},
[
companyRegistraionCancel
]
)


export const socialMediaLinkLRScene = new CoreScene(
  "socialMediaLinkLRScene",
  {
    enter: hdlr.startupSocialMediaLinkLRInitHandler,
    handlers: [
      hdlr.startupSocialMediaLinkLRValueHandler,
      hdlr.startupLREmailHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const socialMediaLinkDoneLRScene = new CoreScene(
"socialMediaLinkDoneLRScene",
{
enter: hdlr.startupSocialMediaLinkDoneLRInitHandler,
handlers: [
  hdlr.startupLREmailHandler,
  hdlr.startupLROfficialPhoneNoHandler,
  hdlr.startupLRHeadQuarterLocationHandler
]
},
[
companyRegistraionCancel
]
)
export const startupRegisteringEditLGMScene = new CoreScene(
  "startupRegisteringEditLGMScene",
  {
    enter: hdlr.startupRegisteringEditLGMInitHandler,
    handlers: [
      hdlr.startupRegisteringEditLGMValueHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const startupRegisteringEditUScene = new CoreScene(
  "startupRegisteringEditUScene",
  {
    enter: hdlr.startupRegisteringEditUInitHandler,
    handlers: [
      hdlr.startupRegisteringEditUValueHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)
export const startupRegisteringEditLRScene = new CoreScene(
  "startupRegisteringEditLRScene",
  {
    enter: hdlr.startupRegisteringEditLRInitHandler,
    handlers: [
      hdlr.startupRegisteringEditLRValueHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const startupRegistrationLGMscene = new CoreScene(
  "startupRegistrationLGMscene",
  {
    enter: hdlr.startupLGMInitHandler,
    handlers: [
      hdlr.startupLGMNameHandler,
      hdlr.startupLGMFoundersHandler,
      hdlr.startupLGMTradeLicensePhotoHandler,
      hdlr.startupLGMIdPhotoHandler,
      hdlr.startupLGMIndustrySectorHandler,
      hdlr.startupLGMEmployeeSizeHandler,
      hdlr.startupLGMWebsiteHandler,
      hdlr.startupLGMSocialMediaLinkHandler,    
      hdlr.startupLGMEmailHandler,
      hdlr.startupLGMOfficialPhoneNoHandler,
      hdlr.startupLGMHeadQuarterLocationHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const startupRegistrationUscene = new CoreScene(
  "startupRegistrationUscene",
  {
    enter: hdlr.startupUInitHandler,
    handlers: [
      hdlr.startupUNameHandler,
      hdlr.startupUFoundersHandler,
      hdlr.startupUIdPhotoHandler,
      hdlr.startupUIndustrySectorHandler,
      hdlr.startupUWebsiteHandler,
      hdlr.startupUSocialMediaLinkHandler,
      hdlr.startupUEmailHandler,
      hdlr.startupUOfficialPhoneNoHandler,
      hdlr.startupUHeadQuarterLocationHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
)
export const startupRegistrationLRscene = new CoreScene(
  "startupRegistrationLRscene",
  {
    enter: hdlr.startupLRInitHandler,
    handlers: [
      hdlr.startupLRNameHandler,
      hdlr.startupLRFoundersHandler,
      hdlr.startupLRTradeLicensePhotoHandler,
      hdlr.startupLRIdPhotoHandler,
      hdlr.startupLRStampedLetterHandler,
      hdlr.startupLRIndustrySectorHandler,
      hdlr.startupLREmployeeSizeHandler,
      hdlr.startupLRWebsiteHandler,
      hdlr.startupLRSocialMediaLinkHandler,
      hdlr.startupLREmailHandler,
      hdlr.startupLROfficialPhoneNoHandler,
      hdlr.startupLRHeadQuarterLocationHandler,
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const startupEditSpecificFieldScene = new CoreScene(
  "startupEditSpecificFieldScene",
  {
    enter: startupEditSpecificFieldInitHandler,
    handlers: [
      hdlr.startupEditSpecificFieldInputHandler,
      hdlr.startupEditSpecificFieldSumitHandler
    ]
  }, [
  companyRegistraionCancel
]
)

export const handOverStartupScene = new CoreScene(
  "handOverStartupScene",
  {
    enter: handOverStartupInitHandler,
    handlers: [
      hdlr.handOverStartupPhoneHandler,
      hdlr.handOverStartupYesNoHandler

    ]
  },
  [
    companyRegistraionCancel
  ]
)