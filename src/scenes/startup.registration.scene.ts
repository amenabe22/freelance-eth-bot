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

export const socialMediaLinkUGMScene = new CoreScene(
  "socialMediaLinkUGMScene",
  {
    enter: hdlr.startupSocialMediaLinkUGMInitHandler,
    handlers: [
      hdlr.startupSocialMediaLinkUGMValueHandler,
      hdlr.startupUGMEmailHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)
export const socialMediaLinkDoneUGMScene = new CoreScene(
"socialMediaLinkDoneUGMScene",
{
enter: hdlr.startupSocialMediaLinkDoneUGMInitHandler,
handlers: [
  hdlr.startupUGMEmailHandler,
  hdlr.startupUGMOfficialPhoneNoHandler,
  hdlr.startupUGMHeadQuarterLocationHandler
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

export const socialMediaLinkURScene = new CoreScene(
  "socialMediaLinkURScene",
  {
    enter: hdlr.startupSocialMediaLinkURInitHandler,
    handlers: [
      hdlr.startupSocialMediaLinkURValueHandler,
      hdlr.startupUREmailHandler
    ]
  },
  [
    companyRegistraionCancel
  ]
)

export const socialMediaLinkDoneURScene = new CoreScene(
"socialMediaLinkDoneURScene",
{
enter: hdlr.startupSocialMediaLinkDoneURInitHandler,
handlers: [
  hdlr.startupUREmailHandler,
  hdlr.startupUROfficialPhoneNoHandler,
  hdlr.startupURHeadQuarterLocationHandler
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

export const startupRegisteringEditUGMScene = new CoreScene(
  "startupRegisteringEditUGMScene",
  {
    enter: hdlr.startupRegisteringEditUGMInitHandler,
    handlers: [
      hdlr.startupRegisteringEditUGMValueHandler
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
export const startupRegisteringEditURScene = new CoreScene(
  "startupRegisteringEditURScene",
  {
    enter: hdlr.startupRegisteringEditURInitHandler,
    handlers: [
      hdlr.startupRegisteringEditURValueHandler
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

export const startupRegistrationUGMscene = new CoreScene(
  "startupRegistrationUGMscene",
  {
    enter: hdlr.startupUGMInitHandler,
    handlers: [
      hdlr.startupUGMNameHandler,
      hdlr.startupUGMFoundersHandler,
      hdlr.startupUGMIdPhotoHandler,
      hdlr.startupUGMIndustrySectorHandler,
      hdlr.startupUGMEmployeeSizeHandler,
      hdlr.startupUGMWebsiteHandler,
      hdlr.startupUGMSocialMediaLinkHandler,
       hdlr.startupUGMEmailHandler,
      hdlr.startupUGMOfficialPhoneNoHandler,
      hdlr.startupUGMHeadQuarterLocationHandler,
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
export const startupRegistrationURscene = new CoreScene(
  "startupRegistrationURscene",
  {
    enter: hdlr.startupURInitHandler,
    handlers: [
      hdlr.startupURNameHandler,
      hdlr.startupURFoundersNameHandler,
      hdlr.startupUPIdphotoHandler,
      hdlr.startupURStampedLetterHandler,     
      hdlr.startupURIndustrySectorHandler, 
      hdlr.startupUREmployeeSizeHandler,
      hdlr.startupURWebsiteHandler,
      hdlr.startupURSocialMediaLinkHandler,
      hdlr.startupUREmailHandler,
      hdlr.startupUROfficialPhoneNoHandler,
      hdlr.startupURHeadQuarterLocationHandler,
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