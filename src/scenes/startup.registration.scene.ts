import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import  {companyRegistraionCancel}  from "../handlers/callbacks"

export const startupRegistrationLGMscene = new CoreScene(
  "startupRegistrationLGMscene",
  {
    enter: hdlr.startupLGMNameHandler,
    handlers: [
      hdlr.startupLGMNameHandler,
      hdlr.startupLGMFounder1Handler,
      hdlr.startupLGMTradeLicensePhotoHandler,
      hdlr.startupLGMIdPhotoHandler,
      hdlr.companyIdPhotoGHandler,
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
  enter: hdlr.startupUGMNameHandler,
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
  enter: hdlr.startupLRNameHandler,
    handlers: [
      hdlr.startupLRFounder1Handler,
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
      hdlr.startupURFounder1NameHandler,
      hdlr.startupURTradeLicensePhoto,
      hdlr.startupUPIdphotoHandler,
      hdlr.startupURStampedLetterHandler,

      
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
