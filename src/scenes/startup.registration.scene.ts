import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import  {companyRegistraionCancel}  from "../handlers/callbacks"
import { handOverStartupInitHandler, startupEditSpecificFieldInitHandler } from "../handlers"

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
      hdlr.startupLGMFacebookLinkHandler,
      hdlr.startupLGMTelegramLinkHandler,
      hdlr.startupLGMYouTubeLinkHandler,
      hdlr.startupLGMTikTokLinkHandler,
      hdlr.startupLGMTwitterLinkHandler,
      hdlr.startupLGMOtherLink1Handler,
      hdlr.startupLGMOtherLink2Handler,
      hdlr.startupLGMOtherLink3Handler,
      hdlr.startupLGMEmailHandler,
      hdlr.startupOfficialPhoneNoHandler,
      hdlr.startupHeadQuarterLocationHandler,
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
      hdlr.startupUGMFirstFounderNameHandler,
      hdlr.startupUGMTradeLicenseHandler,
      hdlr.startupUGMIdPhotoHandler,
      hdlr.startupUGMEmployeeSizeHandler,
      hdlr.startupUGMWebsiteHandler,
      hdlr.startupUGMSectorHandler,
      hdlr.startupUGMPhoneNumberHandler,
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
      hdlr.startupLRFacebookLinkHandler,
      hdlr.startupLRTelegramLinkHandler,
      hdlr.startupLRYouTubeLinkHandler,
      hdlr.startupLRTikTokLinkHandler,
      hdlr.startupLRTwitterLinkHandler,
      hdlr.startupLROtherLink1Handler,
      hdlr.startupLROtherLink2Handler,
      hdlr.startupLROtherLink3Handler,
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
  enter: hdlr.startupURNameHandler,
    handlers: [
      hdlr.startupURNameHandler,
      hdlr.startupURFoundersNameHandler,
      hdlr.startupURTradeLicensePhoto,
      hdlr.startupUPIdphotoHandler,
      hdlr.startupURStampedLetterHandler,      
      hdlr.startupUREmployeeSizeHandler,
      hdlr.startupURWebsiteHandler,
      hdlr.startupURFacebookLinkHandler,
      hdlr.startupURTelegramLinkHandler,
      hdlr.startupURYouTubeLinkHandler,
      hdlr.startupURTikTokLinkHandler,
      hdlr.startupURTwitterLinkHandler,
      hdlr.startupUROtherLink1Handler,
      hdlr.startupUROtherLink2Handler,
      hdlr.startupUROtherLink3Handler,
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