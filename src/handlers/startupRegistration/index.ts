import FormData from "form-data"
import { Telegraf } from "telegraf";
import { fetchCities, fetchCity, fetchStartupSector, fetchStartupSectors } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { cancelKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";
import { registerStartup } from "../../services/startup.process";
import { getUserByPhone, getUserByTelegramId, getUserByTelegramIdStartup, verifyEmailEntity } from "../../services/registration";
import {
  registerStartupConfirmLGMKeyboard,
  registerStartupConfirmUGMKeyboard,
  registerStartupConfirmLRKeyboard,
  starupFounderKeyboard,
  registerStartupToBeEditFieldLGMKeyboard,
  registerStartupToBeEditFieldUGMKeyboard,
  registerStartupToBeEditFieldLRKeyboard,
  startupEditHandOverKeyboard,
  startupEditKeyboard,
  socialMediaYesNoKeyboard,
  socialMediaListLGMKeyboard,
  socialMediaListUGMKeyboard,
  socialMediaListLRKeyboard,
  companyRegisterOptionalKeyboard,


} from "../../keybaords/company.registration_kbs"
import { companyHandOver, companyEdit } from "../../services/company.registration";

import { MAX_ST_FOUNDERS_LIMIT } from "../../constants";
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import path from "path";
import fs from "fs";
import { ve, vp, vw, vn } from "../../utils.py/validation";
import request from "request"

import { formatStartupLGMRegistrationMsg, formatStartupURegistrationMsg, formatStartupLRRegistrationMsg } from "../../utils.py/formatMessage";
let globalState: any;
let totalAddedFounders = 0
var startupNameBold = "";

//licensed startup registering by General managrer starts here.

export const startupLGMInitHandler = async (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx));
}
export const startupLGMNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLGMName = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(ctx.i18n.t('startupTLPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupLGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupLGMFounder${totalAddedFounders}`])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(ctx.i18n.t('startupTLPhotoMsg'), cancelKeyboard(ctx));
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), starupFounderKeyboard(ctx));
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})

export const startupLGMTradeLicensePhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    console.log(ctx.update.message.photo[2].file_id);
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    console.log(downloadURL);
    const fname = `${ctx.from.id}.jpg`
    download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
      console.log("done")
      ctx.replyWithHTML(ctx.i18n.t('startupGMIdPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMIdPhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/GMIdPhoto/${fname}`,).then(async () => {
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLGMSectorName = ctx.message.text;
    const { data, error } = await fetchStartupSector({ name: ctx.scene.state.startupLGMSectorName })
    const { entity_sectors } = data
    console.log(entity_sectors.length, "bpt 1")
    if (!entity_sectors.length) {
      ctx.replyWithHTML(ctx.i18n('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = entity_sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupLGMSectorID = sectorId;
      ctx.scene.state.startupLGMSectorID = sectorId;
      ctx.replyWithHTML(ctx.i18n.t('startupEmployeeMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})
export const startupLGMEmployeeSizeHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMEmployeeSize = " ";
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupLGMEmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupLGMEmployeeSize);
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMWebsite = " ";
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMWebsite = ctx.message.text;
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(ctx.i18n.t('LStartupSocialMediaMsg'), socialMediaListLGMKeyboard(ctx));
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})

export const startupLGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMEmail = null;
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
      }
      ctx.scene.state.startupLGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMOfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupLGMPhoneNumber = ctx.message.text;
    console.log(ctx.scene.state.startupLGMPhoneNumber);
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML(ctx.i18n.t('startupHQMsg'), {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLGMHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLGMHeadQuarterLocation = ctx.message.text;
    const { data, error } = await fetchCity({ name: ctx.scene.state.startupLGMHeadQuarterLocation })
    const { cities } = data
    console.log(data, "bpt 1")
    if (!cities.length) {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupLGMHeadQuarterLocationId = hqId;
      ctx.scene.state.startupLGMHeadQuarterLocationId = hqId;
      ctx.scene.state.startupLGMNameBold = ctx.scene.state.startupLGMName.bold();
      globalState = ctx.scene.state;
      await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmLGMKeyboard(ctx));
      await ctx.replyWithHTML("***********************************", onlyMainMenuKeyboard(ctx));
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})

export const confirmRegisterStartUpLGMHandler = async (ctx: any) => {
  const { data: { users } } = await getUserByTelegramId({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  const [{ phone, first_name, last_name }] = users
  console.log(phone, first_name, last_name)
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupLGMName,
    founder: globalState.startupLGMFounder1,
    phone: globalState.startupLGMPhoneNumber,
    sector_id: globalState.startupLGMSectorID,
    is_user_gm: 'true',
    user_first_name: first_name,
    user_last_name: last_name,
    employee_size: globalState.startupLGMEmployeeSize,
    website: globalState.startupLGMWebsite,
    // email: globalState.startupLGMEmail,
    user_phone: phone,
    telegram_id: ctx.from.id,
    type: 'STARTUP',
    head_quarter: globalState.startupLGMHeadQuarterLocationId,
    facebook_link: globalState.startupLGMFacebookLink,
    telegram_link: globalState.startupLGMTelegramLink,
    youtube_link: globalState.startupLGMYouTubeLink,
    tiktok_link: globalState.startupLGMTikTokLink,
    twitter_link: globalState.startupLGMTwitterLink,
    linkedin_link: globalState.startupLGMLinkedInLink,
    other_link_one: globalState.startupLGMOther1Link,
    other_link_two: globalState.startupLGMOther2Link,
    other_link_three: globalState.startupLGMOther3Link,
    trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  console.log(".................................................................................")
  console.log(payload)
  console.log(".................................................................................")
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }
  console.log("------------------------------------------------------------")
  console.log(payload)
  console.log("------------------------------------------------------------")
  await registerStartup(formData).then(({ data }) => {
    if (data) {
      ctx.deleteMessage();
      console.log(data)
      ctx.reply("sucessfully submitted", cancelKeyboard(ctx))
      // ctx.scene.leave();
    } else {
      ctx.reply("failed creating startup")

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard(ctx))
  })
}
//handling social media in LGM starts here
export const socialMediaAddingActionLGMHandler = async (ctx: any) => {
  ctx.deleteMessage();
  let clicked = ctx.match[0];
  ctx.session.targetedText = clicked.split('-')[0];
  console.log(ctx.session.targetedText);
  console.log(ctx.scene.state.startupLGMFounder1)
  ctx.scene.enter("socialMediaLinkLGMScene", ctx.scene.state)
}

export const startupSocialMediaLinkLGMInitHandler = async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {
    ctx.scene.enter("socialMediaLinkDoneLGMScene", ctx.scene.state);
  }

}

export const startupSocialMediaLinkLGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.scene.state.startupLGMFacebookLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.scene.state.startupLGMTelegramLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.scene.state.startupLGMYouTubeLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.scene.state.startupLGMTikTokLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.scene.state.startupLGMTwitterLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.scene.state.startupLGMLinkedInLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.scene.state.startupLGMOther1Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.scene.state.startupLGMOther2Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.scene.state.startupLGMOther3Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('companyStartupAddMoreMsg'), socialMediaListLGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {

    ctx.scene.enter("socialMediaLinkDoneLGMScene", ctx.scene.state);
  }
})
export const startupSocialMediaLinkDoneLGMInitHandler = async (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), companyRegisterOptionalKeyboard(ctx))
}
// handling social media in LGM ends here

//licensed startup registration with General manager ends here...


//edit startup registeration with LGM starts here
export const editRegisterStartupLGMHandler = async (ctx: any) => {
  ctx.deleteMessage();
  ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
}

export const editRegisterStartupLGMCbActionHandler = async (ctx: any) => {
  console.log("initiating edit scene")
  ctx.deleteMessage();
  const target = ctx.match[0].split(".")[0];
  ctx.scene.state.editTarget = target;
  ctx.session.editTarget = target
  ctx.scene.enter("startupRegisteringEditLGMScene")
}

export const startupRegisteringEditLGMInitHandler = async (ctx: any) => {
  const target = ctx.session.editTarget
  switch (target) {
    case "name":
      ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx));
      return
    case "founderN1":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN2":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN3":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN4":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN5":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "employee":
      ctx.replyWithHTML(ctx.i18n.t('startupEmployeeMsg'), cancelKeyboard(ctx));
      return
    case "sector":
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "facebook":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
      return
    case "telegram":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
      return
    case "youtube":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
      return
    case "tiktok":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
      return
    case "twitter":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
      return
    case "linkedin":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
      return
    case "other1":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other2":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other3":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "phone":
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return
    case "website":
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), cancelKeyboard(ctx));
      return
    case "email":
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), cancelKeyboard(ctx));
      return
    case "location":
      const res = await fetchCities()
      if (res.data) {
        const { cities } = res.data;
        let cnames = cities.map((nm: any) => nm.name);
        ctx.session.cityNames = cnames
        ctx.replyWithHTML(ctx.i18n.t('startupHQMsg'), {
          reply_markup: JSON.stringify({
            keyboard: cnames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "done":
      await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmLGMKeyboard(ctx));
      return
    default:
      break;
  }
}

export const startupRegisteringEditLGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupLGMName = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "founderN1":
        globalState.startupLGMFounder1 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "founderN2":
        globalState.startupLGMFounder2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "founderN3":
        globalState.startupLGMFounder3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "founderN4":
        globalState.startupLGMFounder4 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "founderN5":
        globalState.startupLGMFounder5 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "employee":
        globalState.startupLGMEmployeeSize = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        return
      case "sector":
        globalState.startupLGMSectorName = response
        ctx.scene.state.startupLGMSectorName = response;
        const { data } = await fetchStartupSector({ name: response })
        const { entity_sectors } = data
        console.log(data)
        if (!entity_sectors) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let sectorId = entity_sectors[0].id;
          ctx.session.startupLGMSectorID = sectorId;
          ctx.scene.state.startupLGMSectorID = sectorId;
          await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
          break;
        }
      case "facebook":
        globalState.startupLGMFacebookLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "telegram":
        globalState.startupLGMTelegramLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "youtube":
        globalState.startupLGMYouTubeLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "twitter":
        globalState.startupLGMTwitterLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "tiktok":
        globalState.startupLGMTikTokLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "linkedin":
        globalState.startupLGMLinkedInLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "other1":
        globalState.startupLGMOther1Link = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "other2":
        globalState.startupLGMOtherLink2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "other3":
        globalState.startupLGMOtherLink3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "phone":
        globalState.startupLGMPhoneNumber = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "website":
        globalState.startupLGMWebsite = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "email":
        globalState.startupLGMEmail = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        break;
      case "location":
        globalState.startupLGMHeadQuarterLocation = response
        ctx.scene.state.startupLGMHeadQuarterLocation
        const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
        const { cities } = res.data
        console.log(cities.length, "bpt 1")
        if (!cities.length) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let hqId = cities[0].id;
          ctx.session.startupLGMHeadQuarterLocationId = hqId;
          ctx.scene.state.startupLGMHeadQuarterLocationId = hqId;
          globalState = ctx.scene.state;
        }
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLGMKeyboard(ctx));
        await ctx.replyWithHTML("**********************************", onlyMainMenuKeyboard(ctx))
        return;
      case "done":
        await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmLGMKeyboard(ctx));
        return
      default:
        break;
    }
  }
})

//edit startup registeration with LGM ends here


//Unlicensed startup registration  starts here.
export const startupUInitHandler = async (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx));
}
export const startupUNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMName = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupUFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Done" || ctx.message.text == "ጨረስኩ") {
      ctx.replyWithHTML(ctx.i18n.t('startupFounderIdPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupUGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupUGMFounder${totalAddedFounders} `])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(ctx.i18n.t('startupFounderIdPhotoMsg'), cancelKeyboard(ctx));
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), starupFounderKeyboard(ctx));
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), starupFounderKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), starupFounderKeyboard(ctx));
    return;
  }
})
export const startupUIdPhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/GMIdPhoto/${fname}`,).then(async () => {
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupUIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMSectorName = ctx.message.text;
    const { data, error } = await fetchStartupSector({ name: ctx.scene.state.startupUGMSectorName })
    const { entity_sectors } = data
    console.log(entity_sectors.length, "bpt 1")
    if (!entity_sectors.length) {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = entity_sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupUGMSectorID = sectorId;
      ctx.scene.state.startupUGMSectorID = sectorId;
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})

export const startupUWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMWebsite = " ";
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMWebsite = ctx.message.text;
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})
export const startupUSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(ctx.i18n.t('UStartupSocialMediaMsg'), socialMediaListUGMKeyboard(ctx));
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})

export const startupUEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmail = " ";
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
      }
      ctx.scene.state.startupUGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
  }
})
export const startupUOfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupUGMPhoneNumber = ctx.message.text;
    console.log(ctx.scene.state.startupUGMPhoneNumber);
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupUHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMHeadQuarterLocation = ctx.message.text;
    const { data, error } = await fetchCity({ name: ctx.scene.state.startupUGMHeadQuarterLocation })
    const { cities } = data
    console.log(data, "bpt 1")
    if (!cities.length) {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupUGMHeadQuarterLocationId = hqId;
      ctx.scene.state.startupUGMHeadQuarterLocationId = hqId;
      ctx.scene.state.uStartupName = ctx.i18n.t('companyStartupName')
      ctx.scene.state.uStartupFounder1Name = ctx.i18n.t('startupFounder1')
      ctx.scene.state.uStartupFounder2Name = ctx.i18n.t('startupFounder2')
      ctx.scene.state.uStartupFounder3Name = ctx.i18n.t('startupFounder3')
      ctx.scene.state.uStartupFounder4Name = ctx.i18n.t('startupFounder4')
      ctx.scene.state.uStartupFounder5Name = ctx.i18n.t('startupFounder5')
      ctx.scene.state.uStartupPhone = ctx.i18n.t('companyStartupPhone')
      ctx.scene.state.uStartupSector = ctx.i18n.t('companyStartupSector')
      ctx.scene.state.uStartupWebsite = ctx.i18n.t('companyStartupWebsite')
      ctx.scene.state.uStartupEmail = ctx.i18n.t('companyStartupEmail')
      ctx.scene.state.uStartupHQLocation = ctx.i18n.t('companyStartupHQ')
      ctx.scene.state.uStartupFbLink = ctx.i18n.t('companyStartupFbLink')
      ctx.scene.state.uStartupTgLink = ctx.i18n.t('companyStartupTgLink')
      ctx.scene.state.uStartupYTLink = ctx.i18n.t('companyStartupYTLink')
      ctx.scene.state.uStartupTTLink = ctx.i18n.t('companyStartupTTLink')
      ctx.scene.state.uStartupLILink = ctx.i18n.t('companyStartupLILink')
      ctx.scene.state.uStartupTwitterLink = ctx.i18n.t('companyStartupTwitterLink')
      ctx.scene.state.uStartupOtherL1 = ctx.i18n.t('companyStartupOL1')
      ctx.scene.state.uStartupOtherL2 = ctx.i18n.t('companyStartupOL2')
      ctx.scene.state.uStartupOtherL3 = ctx.i18n.t('companyStartupOL3')
      ctx.scene.state.startupUGMNameBold = ctx.scene.state.startupUGMName.bold();
      globalState = ctx.scene.state
      await ctx.replyWithHTML(formatStartupURegistrationMsg(globalState), registerStartupConfirmUGMKeyboard(ctx))
      await ctx.replyWithHTML("****************************", onlyMainMenuKeyboard(ctx))
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})

export const confirmRegisterStartUpUGMHandler = async (ctx: any) => {
  const { data: { users } } = await getUserByTelegramId({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  const [{ phone, first_name, last_name }] = users
  console.log(phone, first_name, last_name)
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupUGMName,
    founder: globalState.startupUGMFounder1,
    phone: globalState.startupUGMPhoneNumber,
    sector_id: globalState.startupUGMSectorID,
    is_user_gm: 'true',
    user_first_name: first_name,
    user_last_name: last_name,
    employee_size: globalState.startupUGMEmployeeSize,
    website: globalState.startupUGMWebsite,
    // email: globalState.startupUGMEmail,
    user_phone: phone,
    telegram_id: ctx.from.id,
    type: 'STARTUP',
    head_quarter: globalState.startupUGMHeadQuarterLocationId,
    facebook_link: globalState.startupUGMFacebookLink,
    telegram_link: globalState.startupUGMTelegramLink,
    youtube_link: globalState.startupUGMYouTubeLink,
    tiktok_link: globalState.startupUGMTikTokLink,
    twitter_link: globalState.startupUGMTwitterLink,
    linkedin_link: globalState.startupUGMLinkedInLink,
    other_link_one: globalState.startupUGMOther1Link,
    other_link_two: globalState.startupLGMOther2Link,
    other_link_three: globalState.startupUGMOther3Link,
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  console.log(".................................................................................")
  console.log(payload)
  console.log(".................................................................................")
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }
  console.log("------------------------------------------------------------")
  console.log(payload)
  console.log("------------------------------------------------------------")
  await registerStartup(formData).then(({ data }) => {
    if (data) {
      ctx.deleteMessage();
      console.log(data)
      ctx.reply("sucessfully submitted", cancelKeyboard(ctx))
      // ctx.scene.leave();
    } else {

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard(ctx))
  })
}

//Unicensed startup registration endes here...

//handling social media for Ustarts here...
export const socialMediaAddingActionUHandler = async (ctx: any) => {
  ctx.deleteMessage();
  let clicked = ctx.match[0];
  ctx.session.targetedText = clicked.split('-')[0];
  console.log(ctx.session.targetedText);
  console.log(ctx.scene.state.startupUGMFounder1)
  ctx.scene.enter("socialMediaLinkUScene", ctx.scene.state)

}

export const startupSocialMediaLinkUInitHandler = async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {
    ctx.scene.enter("socialMediaLinkDoneUScene", ctx.scene.state);
  }

}

export const startupSocialMediaLinkUValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.scene.state.startupUGMFacebookLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.scene.state.startupUGMTelegramLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.scene.state.startupUGMYouTubeLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.scene.state.startupUGMTikTokLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.scene.state.startupUGMTwitterLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.scene.state.startupUGMLinkedInLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.scene.state.startupUGMOther1Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.scene.state.startupUGMOther2Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.scene.state.startupUGMOther3Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListUGMKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {
    ctx.scene.enter("socialMediaLinkDoneUScene", ctx.scene.state);
  }
})
export const startupSocialMediaLinkDoneUInitHandler = async (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx))
}
//handling social media for UGM ends here...

//edit startup registeration with UGM starts here

export const editRegisterStartupUHandler = async (ctx: any) => {
  ctx.deleteMessage();
  ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
}
export const editRegisterStartupUCbActionHandler = async (ctx: any) => {
  ctx.deleteMessage();
  console.log("initiating edit scene")
  const target = ctx.match[0].split(".")[0];
  ctx.scene.state.editTarget = target;
  ctx.session.editTarget = target
  return ctx.scene.enter("startupRegisteringEditUScene")
}

export const startupRegisteringEditUInitHandler = async (ctx: any) => {
  const target = ctx.session.editTarget
  switch (target) {
    case "name":
      console.log("2")
      ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx));
      return
    case "founderN1":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN2":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN3":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN4":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN5":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "employee":
      ctx.replyWithHTML(ctx.i18n.t('startupEmployeeMsg'), cancelKeyboard(ctx));
      return
    case "sector":
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "facebook":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
      return
    case "telegram":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
      return
    case "youtube":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
      return
    case "tiktok":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
      return
    case "twitter":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
      return
    case "linkedin":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
      return
    case "other1":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other2":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other3":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "phone":
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return
    case "website":
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), cancelKeyboard(ctx));
      return
    case "email":
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), cancelKeyboard(ctx));
      return
    case "location":
      const res = await fetchCities()
      if (res.data) {
        const { cities } = res.data;
        let cnames = cities.map((nm: any) => nm.name);
        ctx.session.cityNames = cnames
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: cnames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "done":
      await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmUGMKeyboard(ctx));
      return;
    default:
      break;
  }
}

export const startupRegisteringEditUValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupUGMName = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "founderN1":
        globalState.startupUGMFounder1 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "founderN2":
        globalState.startupUGMFounder2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "founderN3":
        globalState.startupUGMFounder3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "founderN4":
        globalState.startupUGMFounder4 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "founderN5":
        globalState.startupUGMFounder5 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "employee":
        globalState.startupUGMEmployeeSize = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        return
      case "sector":
        globalState.startupUGMSectorName = response
        ctx.scene.state.startupUGMSectorName = response;
        const { data } = await fetchStartupSector({ name: response })
        const { entity_sectors } = data
        console.log(data)
        if (!entity_sectors) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let sectorId = entity_sectors[0].id;
          ctx.session.startupUGMSectorID = sectorId;
          ctx.scene.state.startupUGMSectorID = sectorId;
          await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
          break;
        }
      case "facebook":
        globalState.startupUGMFacebookLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "telegram":
        globalState.startupUGMTelegramLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "youtube":
        globalState.startupUGMYouTubeLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "twitter":
        globalState.startupUGMTwitterLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "tiktok":
        globalState.startupUGMTikTokLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "linkedin":
        globalState.startupUGMLinkedInLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "other1":
        globalState.startupUGMOther1Link = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "other2":
        globalState.startupUGMOtherLink2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "other3":
        globalState.startupUGMOtherLink3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "phone":
        globalState.startupUGMPhoneNumber = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "website":
        globalState.startupUGMWebsite = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "email":
        globalState.startupUGMEmail = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        break;
      case "sector":
        globalState.startupUGMHeadQuarterLocation = response
        ctx.scene.state.startupUGMHeadQuarterLocation
        const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
        const { cities } = res.data
        console.log(cities.length, "bpt 1")
        if (!cities.length) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let hqId = cities[0].id;
          ctx.session.startupUGMHeadQuarterLocationId = hqId;
          ctx.scene.state.startupUGMHeadQuarterLocationId = hqId;
          globalState = ctx.scene.state;
        }
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldUGMKeyboard(ctx));
        await ctx.replyWithHTML("***********************", onlyMainMenuKeyboard(ctx));
        return
      case "done":
        await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmUGMKeyboard(ctx));
        return;
      default:
        break;
    }
  }
})
//edit startup registeration with U ends here


//licensed startup registraion with Representative starts here...
export const startupLRInitHandler = (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx))
}
export const startupLRNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRName = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLRFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(ctx.i18n.t('startupTLPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupLRFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupLRFounder${totalAddedFounders}`]);
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(ctx.i18n.t('startupTLPhotoMsg'), cancelKeyboard(ctx));
        return ctx.wizard.next();
      } else {
        ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), starupFounderKeyboard(ctx));
      }
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLRTradeLicensePhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    console.log(ctx.update.message.photo[2].file_id);
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    console.log(downloadURL);
    const fname = `${ctx.from.id}.jpg`
    download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
      ctx.replyWithHTML(ctx.i18n.t('startupRepIdPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return
  }
})
export const startupLRIdPhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/GMIdPhoto/${fname}`,).then(async () => {
      ctx.replyWithHTML(ctx.i18n.t('startupRepLetterPhotoMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLRStampedLetterHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/letterPhoto/${fname}`,).then(async () => {
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = ctx.session.sectorNames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
  }
})
export const startupLRIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRSectorName = ctx.message.text;
    const { data, error } = await fetchStartupSector({ name: ctx.scene.state.startupLRSectorName })
    const { entity_sectors } = data
    console.log(entity_sectors.length)
    if (!entity_sectors.length) {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = entity_sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupLRSectorID = sectorId;
      ctx.scene.state.startupLRSectorID = sectorId;
      ctx.replyWithHTML(ctx.i18n.t('startupEmployeeMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})
export const startupLREmployeeSizeHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLREmployeeSize = " ";
      console.log(ctx.scene.state.startupLREmployeeSize);
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupLREmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupLREmployeeSize);
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})
export const startupLRWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRWebsite = " ";
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRWebsite = ctx.message.text;
      ctx.replyWithHTML(ctx.i18n.t('startupAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})
export const startupLRSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), companyRegisterOptionalKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(ctx.i18n.t('LStartupSocialMediaMsg'), socialMediaListLRKeyboard(ctx));
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})

export const startupLREmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLREmail = " ";
      console.log(ctx.scene.state.startupLREmail);
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.reply("Sorry email is already taken !")
        return;
      }
      ctx.scene.state.startupLREmail = ctx.message.text;
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
      return;
    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
    return;
  }
})
export const startupLROfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupLRPhoneNumber = ctx.message.text;
    console.log(ctx.scene.state.startupLRPhoneNumber);
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
    return;
  }
})
export const startupLRHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRHeadQuarterLocation = ctx.message.text;
    const { data, error } = await fetchCity({ name: ctx.scene.state.startupLRHeadQuarterLocation })
    const { cities } = data
    console.log(cities, "bpt 1")
    if (!cities.length) {
      ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupLRHeadQuarterLocationId = hqId;
      ctx.scene.state.startupLRHeadQuarterLocationId = hqId;
      ctx.scene.state.startupLRNameBold = ctx.scene.state.startupLRName.bold();
      globalState = ctx.scene.state
      ctx.replyWithHTML(formatStartupLRRegistrationMsg(globalState), registerStartupConfirmLRKeyboard(ctx))
      await ctx.replyWithHTML("****************************", onlyMainMenuKeyboard(ctx))

    }
  } else {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
});
export const confirmRegisterStartUpLRHandler = async (ctx: any) => {
  const { data: { users } } = await getUserByTelegramId({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  const [{ phone, first_name, last_name }] = users
  console.log(phone, first_name, last_name)
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupLRName,
    founder: globalState.startupLRFounder1,
    phone: globalState.startupLRPhoneNumber,
    sector_id: globalState.startupLRSectorID,
    is_user_gm: 'true',
    user_first_name: first_name,
    user_last_name: last_name,
    employee_size: globalState.startupLREmployeeSize,
    website: globalState.startupLRWebsite,
    // email: globalState.startupLREmail,
    user_phone: phone,
    telegram_id: ctx.from.id,
    type: 'STARTUP',
    head_quarter: globalState.startupLRHeadQuarterLocationId,
    facebook_link: globalState.startupLRFacebookLink,
    telegram_link: globalState.startupLRTelegramLink,
    youtube_link: globalState.startupLRYouTubeLink,
    tiktok_link: globalState.startupLRTikTokLink,
    twitter_link: globalState.startupLRTwitterLink,
    linkedin_link: globalState.startupLRLinkedInLink,
    other_link_one: globalState.startupLROther1Link,
    other_link_two: globalState.startupLROther2Link,
    other_link_three: globalState.startupLROther3Link,
    trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  console.log(".................................................................................")
  console.log(payload)
  console.log(".................................................................................")
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }
  console.log("------------------------------------------------------------")
  console.log(payload)
  console.log("------------------------------------------------------------")
  await registerStartup(formData).then(({ data }) => {
    if (data) {
      ctx.deleteMessage();
      console.log(data)
      ctx.reply("sucessfully submitted", cancelKeyboard(ctx))
      // ctx.scene.leave();
    } else {

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard(ctx))
  })
}
//licensed startup registration with representative ends here...


// handling social media links for LR starts Here


export const socialMediaAddingActionLRHandler = async (ctx: any) => {
  ctx.deleteMessage();
  let clicked = ctx.match[0];
  ctx.session.targetedText = clicked.split('-')[0];
  console.log(ctx.session.targetedText);
  console.log(ctx.scene.state.startupLRFounder1)
  ctx.scene.enter("socialMediaLinkLRScene", ctx.scene.state)

}

export const startupSocialMediaLinkLRInitHandler = async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {
    ctx.scene.enter("socialMediaLinkDoneLRScene", ctx.scene.state);
  }

}

export const startupSocialMediaLinkLRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.session.targetedText == "facebook") {
    ctx.scene.state.startupUGMFacebookLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "telegram") {
    ctx.scene.state.startupLRTelegramLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "youtube") {
    ctx.scene.state.startupLRYouTubeLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "tiktok") {
    ctx.scene.state.startupLRTikTokLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "twitter") {
    ctx.scene.state.startupLRTwitterLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "linkedin") {
    ctx.scene.state.startupLRLinkedInLink = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink1") {
    ctx.scene.state.startupLROther1Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink2") {
    ctx.scene.state.startupLROther2Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "otherlink3") {
    ctx.scene.state.startupLROther3Link = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t("companyStartupAddMoreMsg"), socialMediaListLRKeyboard(ctx));
  } else if (ctx.session.targetedText == "done") {
    ctx.scene.enter("socialMediaLinkDoneLRScene", ctx.scene.state);
  }
})
export const startupSocialMediaLinkDoneLRInitHandler = async (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), companyRegisterOptionalKeyboard(ctx))
}

// hanling social media links for LR ends here


//edit startup registeration with LR starts here

export const editRegisterStartupLRHandler = async (ctx: any) => {
  ctx.deleteMessage();
  ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
}
export const editRegisterStartupLRCbActionHandler = async (ctx: any) => {
  ctx.deleteMessage();
  console.log("initiating edit scene")
  const target = ctx.match[0].split(".")[0];
  ctx.scene.state.editTarget = target;
  ctx.session.editTarget = target
  return ctx.scene.enter("startupRegisteringEditLRScene")
}

export const startupRegisteringEditLRInitHandler = async (ctx: any) => {
  const target = ctx.session.editTarget
  switch (target) {
    case "name":
      console.log("2")
      ctx.replyWithHTML(ctx.i18n.t('startupNameMsg'), cancelKeyboard(ctx));
      return
    case "founderN1":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN2":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN3":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN4":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "founderN5":
      ctx.replyWithHTML(ctx.i18n.t('startupFounderMsg'), cancelKeyboard(ctx));
      return
    case "employee":
      ctx.replyWithHTML(ctx.i18n.t('startupEmployeeMsg'), cancelKeyboard(ctx));
      return
    case "sector":
      const { data, error } = await fetchStartupSectors()
      if (data) {
        const { entity_sectors } = data;
        let snames = entity_sectors.map((nm: any) => nm.en);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "facebook":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Facebook)", cancelKeyboard(ctx));
      return
    case "telegram":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Telegram)", cancelKeyboard(ctx));
      return
    case "youtube":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (YouTube)", cancelKeyboard(ctx));
      return
    case "tiktok":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (TikTok)", cancelKeyboard(ctx));
      return
    case "twitter":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Twitter)", cancelKeyboard(ctx));
      return
    case "linkedin":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (LinkedIn)", cancelKeyboard(ctx));
      return
    case "other1":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other2":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "other3":
      ctx.replyWithHTML(ctx.i18n.t('companyStartupEnterLinkMsg') + " (Other)", cancelKeyboard(ctx));
      return
    case "phone":
      ctx.replyWithHTML(ctx.i18n.t('startupPhoneNumberMsg'), cancelKeyboard(ctx));
      return
    case "website":
      ctx.replyWithHTML(ctx.i18n.t('startupWebsiteMsg'), cancelKeyboard(ctx));
      return
    case "email":
      ctx.replyWithHTML(ctx.i18n.t('startupEmailMsg'), cancelKeyboard(ctx));
      return
    case "location":
      const res = await fetchCities()
      if (res.data) {
        const { cities } = res.data;
        let cnames = cities.map((nm: any) => nm.name);
        ctx.session.cityNames = cnames
        ctx.replyWithHTML(ctx.i18n.t('startupSectorMsg'), {
          reply_markup: JSON.stringify({
            keyboard: cnames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return
    case "done":
      await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmLRKeyboard(ctx));
      return;
    default:
      break;
  }
}

export const startupRegisteringEditLRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupUGMName = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "founderN1":
        globalState.startupUGMFounder1 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "founderN2":
        globalState.startupUGMFounder2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "founderN3":
        globalState.startupUGMFounder3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "founderN4":
        globalState.startupUGMFounder4 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "founderN5":
        globalState.startupUGMFounder5 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "employee":
        globalState.startupUGMEmployeeSize = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        return
      case "sector":
        globalState.startupUGMSectorName = response
        ctx.scene.state.startupUGMSectorName = response;
        const { data } = await fetchStartupSector({ name: response })
        const { entity_sectors } = data
        console.log(data)
        if (!entity_sectors) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let sectorId = entity_sectors[0].id;
          ctx.session.startupUGMSectorID = sectorId;
          ctx.scene.state.startupUGMSectorID = sectorId;
          await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
          break;
        }
      case "facebook":
        globalState.startupUGMFacebookLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "telegram":
        globalState.startupUGMTelegramLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "youtube":
        globalState.startupUGMYouTubeLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "twitter":
        globalState.startupUGMTwitterLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "tiktok":
        globalState.startupUGMTikTokLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "linkedin":
        globalState.startupUGMLinkedInLink = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "other1":
        globalState.startupUGMOther1Link = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "other2":
        globalState.startupUGMOtherLink2 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "other3":
        globalState.startupUGMOtherLink3 = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "phone":
        globalState.startupUGMPhoneNumber = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "website":
        globalState.startupUGMWebsite = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "email":
        globalState.startupUGMEmail = response
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        break;
      case "sector":
        globalState.startupUGMHeadQuarterLocation = response
        ctx.scene.state.startupUGMHeadQuarterLocation
        const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
        const { cities } = res.data
        console.log(cities.length, "bpt 1")
        if (!cities.length) {
          ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
              keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                text: x,
              }])), resize_keyboard: true, one_time_keyboard: true,
            }),
          })
          return;
        } else {
          let hqId = cities[0].id;
          ctx.session.startupUGMHeadQuarterLocationId = hqId;
          ctx.scene.state.startupUGMHeadQuarterLocationId = hqId;
          globalState = ctx.scene.state;
        }
        await ctx.replyWithHTML(ctx.i18n.t('companyStartupEditMoreMsg'), registerStartupToBeEditFieldLRKeyboard(ctx));
        await ctx.replyWithHTML("***********************", onlyMainMenuKeyboard(ctx));
        return
      case "done":
        await ctx.replyWithHTML(formatStartupLGMRegistrationMsg(globalState), registerStartupConfirmLRKeyboard(ctx));
        return;
      default:
        break;
    }
  }
})
//edit startup registeration with LR ends here


// Under here it handover and edit handlers 

export const startupSelectionActionHandler = async (ctx: any) => {
  ctx.deleteMessage()
  const selectedStartup = ctx.match[0];
  console.log(selectedStartup);
  const { data, error } = await getUserByTelegramIdStartup({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  if (data) {
    let userId = data.users[0].id;
    console.log(userId, "user id");
    ctx.session.sourceStartupUserId = userId;
    console.log(ctx.session.sourceStartupUserId, "hm");
    let checkUserEntity = data.users[0].user_entities;
    console.log(checkUserEntity);
    if (checkUserEntity) {
      let myStartups = checkUserEntity.filter((startup: any) => {
        if (startup.entity["verified_at"] != null) {
          return true;
        }
      });
      console.log("my startups list", myStartups)
      ctx.session.userSName = myStartups.map((nam: any) => (nam.entity["name"]))
      console.log(ctx.session.userSName)
      ctx.session.userSId = myStartups.map((nam: any) => nam.entity["id"])
      console.log(ctx.session.userSId);
      if (selectedStartup == 60) {
        ctx.session.selectedStartupName = ctx.session.userSName[0];
        ctx.session.selectedStartupId = ctx.session.userSId[0];
      } else if (selectedStartup == 61) {
        ctx.session.selectedStartupName = ctx.session.userSName[1];
        ctx.session.selectedStartupId = ctx.session.userSId[1];
      } else if (selectedStartup == 62) {
        ctx.session.selectedStartupName = ctx.session.userSName[2];
        ctx.session.selectedStartupId = ctx.session.userSId[2];
      }
      else if (selectedStartup == 63) {
        ctx.session.selectedStartupName = ctx.session.userSName[3];
        ctx.session.selectedStartupId = ctx.session.userSId[3];
      }
      else if (selectedStartup == 64) {
        ctx.session.selectedStartupName = ctx.session.userSName[4];
        ctx.session.selectedStartupId = ctx.session.userSId[4];
      }
      else if (selectedStartup == 65) {
        ctx.session.selectedStartupName = ctx.session.userSName[5];
        ctx.session.selectedStartupId = ctx.session.userSId[5];
      }
      else if (selectedStartup == 66) {
        ctx.session.selectedStartupName = ctx.session.userSName[6];
        ctx.session.selectedStartupId = ctx.session.userSId[6];
      }
      else if (selectedStartup == 67) {
        ctx.session.selectedStartupName = ctx.session.userSName[7];
        ctx.session.selectedStartupId = ctx.session.userSId[7];
      }
      else if (selectedStartup == 68) {
        ctx.session.selectedStartupName = ctx.session.userSName[8];
        ctx.session.selectedStartupId = ctx.session.userSId[8];
      }
      else if (selectedStartup == 69) {
        ctx.session.selectedStartupName = ctx.session.userSName[9];
        ctx.session.selectedStartupId = ctx.session.userSId[9];
      }
      else if (selectedStartup == 60) {
        ctx.session.selectedStartupName = ctx.session.userSName[10];
        ctx.session.selectedStartupId = ctx.session.userSId[10];
      }
      else if (selectedStartup == 71) {
        ctx.session.selectedStartupName = ctx.session.userSName[11];
        ctx.session.selectedStartupId = ctx.session.userSId[11];
      }
      console.log(ctx.session.selectedStartupName);
      console.log(ctx.session.selectedStartupId);
      startupNameBold = ctx.session.selectedStartupName.bold();
      await ctx.replyWithHTML(`${startupNameBold} \n ******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, startupEditHandOverKeyboard)
      await ctx.replyWithHTML("*************************************", {
        reply_markup: {
          keyboard: [[{ text: "Main Menu" }],], resize_keyboard: true, one_time_keyboard: true
        }
      })
    }
  }
}


export const startupEditHandler = async (ctx: any) => {
  ctx.deleteMessage();
  await ctx.replyWithHTML(`${startupNameBold} \n ******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, startupEditKeyboard);
}

export const startupEditFieldHandler = async (ctx: any) => {
  ctx.session.tobeEditedStartupField = ctx.match[0];
  console.log(ctx.session.tobeEditedStartupField);
  const { data, error } = await fetchCities()
  if (data) {
    const { cities } = data;
    let cnames = cities.map((nm: any) => nm.name);
    ctx.session.cityNames = cnames;
  }
  ctx.scene.enter("startupEditSpecificFieldScene")
}

export const startupEditSpecificFieldInitHandler = async (ctx: any) => {
  ctx.deleteMessage();
  console.log(ctx.session.tobeEditedStartupField, "hm")
  if (ctx.session.tobeEditedStartupField == "edit_name_of_startup") {
    ctx.replyWithHTML("please enter the new name of your startup", cancelKeyboard(ctx));
  } else if (ctx.session.tobeEditedStartupField == "edit_employee_of_startup") {
    ctx.replyWithHTML("please enter the new employee size of your startup", cancelKeyboard(ctx));
  } else if (ctx.session.tobeEditedStartupField == "edit_email_of_startup") {
    ctx.replyWithHTML("please enter the new email of your startup", cancelKeyboard(ctx));
  } else if (ctx.session.tobeEditedStartupField == "edit_phone_of_startup") {
    ctx.replyWithHTML("please enter the new phone no of your startup", cancelKeyboard(ctx));
  } else if (ctx.session.tobeEditedStartupField == "edit_location_of_startup") {
    ctx.replyWithHTML("please enter the new location of your company", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, _: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    });
  } else if (ctx.session.tobeEditedStartupField == "edit_websit_of_startup") {
    ctx.replyWithHTML("please enter the new website of your startup", cancelKeyboard(ctx));
  }
}
export const startupEditSpecificFieldInputHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.session.tobeEditedStartupField == "edit_name_of_startup") {
      ctx.scene.state.toBeEditedStartupNameField = ctx.message.text;
      console.log(ctx.session.selectedStartupId)
      const { data, errors } = await companyEdit({
        "id": ctx.session.selectedStartupId,
        "set": {
          "name": ctx.scene.state.toBeEditedStartupNameField
        }

      })
      if (errors) {
        console.log(errors);
      } else {
        console.log(data);
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
      }
    } else if (ctx.session.tobeEditedStartupField == "edit_employee_of_startup") {
      ctx.scene.state.tobeEditedStartupEmployeeSizeField = ctx.message.text;
      const { data, errors } = await companyEdit({
        "id": ctx.session.selectedStartupId,
        "set": {
          "employee_size": ctx.scene.state.tobeEditedStartupEmployeeSizeField
        }

      })
      if (errors) {
        console.log(errors);
      } else {
        console.log(data);
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
      }
    }
    else if (ctx.session.tobeEditedStartupField == "edit_email_of_startup") {
      ctx.scene.state.tobeEditedStartupEmailField = ctx.message.text;
      const { data, errors } = await companyEdit({
        "id": ctx.session.selectedStartupId,
        "set": {
          "email": ctx.scene.state.tobeEditedStartupEmailField
        }

      })
      if (errors) {
        console.log(errors);
      } else {
        console.log(data);
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
      }
    }
    else if (ctx.session.tobeEditedStartupField == "edit_phone_of_startup") {
      ctx.scene.state.tobeEditedStartupPhoneField = ctx.message.text;
      const { data, errors } = await companyEdit({
        "id": ctx.session.selectedStartupId,
        "set": {
          "phone": ctx.scene.state.tobeEditedStartupPhoneField
        }

      })
      if (errors) {
        console.log(errors);
      } else {
        console.log(data);
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
      }
    }
    else if (ctx.session.tobeEditedStartupField == "edit_location_of_startup") {
      ctx.scene.state.tobeEditedStartupLocationField = ctx.message.text;
      const { data, error } = await fetchCity({ name: ctx.scene.state.tobeEditedStartupLocationField })
      const { cities } = data
      console.log(cities.length, "bpt 1")
      if (!cities.length) {
        ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
          reply_markup: JSON.stringify({
            keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
        return;
      } else {
        let hqId = cities[0].id;
        ctx.session.startupHeadQuarterLocationId = hqId;
        ctx.scene.state.startupHeadQuarterLocationId = hqId;
        const { data, errors } = await companyEdit({
          "id": ctx.session.selectedStartupId,
          "set": {
            "head_quarter": ctx.scene.state.startupHeadQuarterLocationId
          }

        })
        if (errors) {
          console.log(errors);
        } else {
          console.log(data);
          ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
        }
      }
    } else if (ctx.session.tobeEditedStartupField == "edit_websit_of_startup") {
      ctx.scene.state.tobeEditedStartupWebsiteField == ctx.message.text;
      const { data, errors } = await companyEdit({
        "id": ctx.session.selectedStartupId,
        "set": {
          "website": ctx.scene.state.tobeEditedStartupWebsiteField
        }

      })
      if (errors) {
        console.log(errors);
      } else {
        console.log(data);
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
      }
    }
  }
})

export const startupEditSpecificFieldSumitHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

})





export const startupHandOverHandler = async (ctx: any) => {
  ctx.scene.enter("handOverStartupScene");
}

export const handOverStartupInitHandler = async (ctx: any) => {
  ctx.deleteMessage();
  ctx.replyWithHTML("Please send us representative phone number", cancelKeyboard(ctx))
}
export const handOverStartupPhoneHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.representativePhone = ctx.message.text;
    console.log(ctx.scene.state.representativePhone);
    ctx.scene.state.representativeCompanyPhone = ctx.message.text;
    const { data: { users } } = await getUserByPhone({
      phone: ctx.scene.state.representativeCompanyPhone
    })
    if (!users.length) {
      ctx.replyWithHTML("User registered by this user does not exist on our database please use different number", cancelKeyboard(ctx));
      return;
    } else {
      let destId = users[0].id;
      ctx.session.destinationStartupId = destId;
      let BoldRepNo = ctx.message.text.bold();
      ctx.replyWithHTML(`please confirm representative phone \n\n${BoldRepNo} \n\nNote: They will have access to companies once its given`, {
        reply_markup: {
          keyboard: [
            [{ text: "Yes" }, { text: "No" }],
          ], resize_keyboard: true, one_time_keyboard: true
        }
      })
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML("Please enter a valid phone number", cancelKeyboard(ctx))
  }
})
export const handOverStartupYesNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Yes") {
      console.log(ctx.session.selectedStartupId)
      console.log(ctx.session.sourceStartupUserId)
      console.log(ctx.session.destinationStartupId);
      if (ctx.message.text == "Yes") {
        const { data, errors } = await companyHandOver({
          "object": {
            "entity_id": `${ctx.session.selectedStartupId} `,
            "from_user_id": `${ctx.session.sourceStartupUserId} `,
            "to_user_id": `${ctx.session.destinationStartupId} `,
            "created_by": `${ctx.session.sourceStartupUserId} `
          }

        })
        if (errors) {
          console.log(errors);
          ctx.replyWithHTML(`Error cease you from handing over your Startup`, cancelKeyboard(ctx));
        } else {
          console.log(data)
          ctx.replyWithHTML("You have successfully handed over your Startup", cancelKeyboard(ctx));
        }
        // ;
      } else if (ctx.message.text == "No") {
        ctx.replyWithHTML("You haven't handed over your startup", cancelKeyboard(ctx))
      }
      // 
    }
  }
})
