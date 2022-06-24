import FormData from "form-data"
import { Telegraf } from "telegraf";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { registerStartup } from "../../services/startup.process";
import { getUserByPhone, getUserByTelegramId } from "../../services/registration";
import {
  registerStartupConfirmLGMKeyboard,
  registerStartupConfirmUGMKeyboard,
  registerStartupConfirmLRKeyboard,
  registerStartupConfirmURKeyboard, 
  startupRegisterOptionalKeyboard,
  starupFounderKeyboard,
  registerStartupToBeEditFieldLGMKeyboard,
  registerStartupToBeEditFieldUGMKeyboard,
  registerStartupToBeEditFieldLRKeyboard,
  registerStartupToBeEditFieldURKeyboard,
  // startupCompanyEditKeyboard, 
  startupEditHandOverKeyboard,
  startupEditKeyboard
} from "../../keybaords/company.registration_kbs"
import { companyHandOver } from "../../services/company.registration";

import { MAX_ST_FOUNDERS_LIMIT } from "../../constants";
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import path from "path";
import fs from "fs";
import { ve, vp, vw, vn } from "../../utils.py/validation";
let globalState: any;

let totalAddedFounders = 0
var startupNameBold = "";

//licensed startup registering by General managrer starts here.

export const startupLGMInitHandler = async (ctx: any) => {
  ctx.replyWithHTML('please enter the name of your startup', cancelKeyboard);
}
export const startupLGMNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLGMName = ctx.message.text;
    ctx.replyWithHTML(`please enter startup founder name`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter a valid startup G/M name!`, cancelKeyboard);
    return;
  }
})
export const startupLGMFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => { 
  if (ctx.message.text) {
    ctx.scene.state.startupLGMFounder2 = " "
    ctx.scene.state.startupLGMFounder3 = " "
    ctx.scene.state.startupLGMFounder4 = " "
    ctx.scene.state.startupLGMFounder5 = " "
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupLGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupLGMFounder${totalAddedFounders}`])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(`please enter startup founder name`, starupFounderKeyboard);
    } else {
      ctx.replyWithHTML(`please enter a valid startup fundar name !`, starupFounderKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup fundar name !`, starupFounderKeyboard);
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
      ctx.replyWithHTML(`please enter G/M id photo.`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
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
      const { data, error } = await fetchSectors()
      if (data) {
        const { sectors } = data;
        let snames = sectors.map((nm: any) => nm.name);
        ctx.session.sectorNames = snames
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: snames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid G/M id photo!`, cancelKeyboard);
    return;
  }
})
export const startupLGMIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLGMSectorName = ctx.message.text;
    const { data, error } = await fetchSector({ name: ctx.scene.state.startupLGMSectorName })
    const { sectors } = data
    console.log(sectors.length, "bpt 1")
    if (!sectors.length) {
      ctx.replyWithHTML("please enter valid industry sector!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupLGMSectorID = sectorId;
      ctx.scene.state.startupLGMSectorID = sectorId;
      ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML("please enter valid industry sector!", {
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
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupLGMEmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupLGMEmployeeSize);
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMWebsite = " ";
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMWebsite = ctx.message.text;
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMFacebookLink = " ";
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMFacebookLink = ctx.message.text;
      console.log(ctx.scene.state.startupLGMFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTelegramLink = " ";
      console.log(ctx.scene.state.startupLGMTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMTelegramLink = ctx.message.text;
      console.log(ctx.scene.state.startupLGMTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMYouTubeLink = " ";
      console.log(ctx.scene.state.startupLGMYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMYouTubeLink = ctx.message.text;
      console.log(ctx.scene.state.startupLGMYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
    console.log(ctx.scene.state.startupLGMYouTubeLink);
    ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTikTokLink = " ";
      console.log(ctx.scene.state.startupLGMTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMTikTokLink = ctx.message.text;
      console.log(ctx.scene.state.startupLGMTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTwitterLink = " ";
      console.log(ctx.scene.state.startupLGMTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next()
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMTwitterLink = ctx.message.text;
      console.log(ctx.scene.state.startupLGMTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next()
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther1Link = " ";
      console.log(ctx.scene.state.startupLGMOther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMOther1Link = ctx.message.text;
      console.log(ctx.scene.state.startupLGMOther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther2Link = " ";
      console.log(ctx.scene.state.startupLGMOther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMOther2Link = ctx.message.text;
      console.log(ctx.scene.state.startupLGMOther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther3Link = " ";
      console.log(ctx.scene.state.startupLGMOther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMOther3Link = ctx.message.text;
      console.log(ctx.scene.state.startupLGMOther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMEmail = " ";
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      ctx.scene.state.startupLGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
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
      ctx.replyWithHTML("please enter location of your startup head quarter.", {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
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
      ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupLGMHeadQuarterLocation = hqId;
      ctx.scene.state.startupLGMHeadQuarterLocation = hqId;
      globalState = ctx.scene.state;
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
    }
  } else {
    ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})

// export const confirmRegisteringStartupUGMActionHandler = async (ctx: any) => {
//   const formData = new FormData();
//   const payload: any = {
//     name: globalState.startupUGMName,
//     founder: globalState.startupUGMFounder1,
//     phone: globalState.startupUGMPhoneNumber,
//     sector: globalState.startupLGMSectorID,
//     is_user_gm: globalState.statupLGMIsUserGm,
//     user_first_name: globalState.startupLGMUFN,
//     user_last_name: globalState.startupLGMULN,
//     employee_size: globalState.startupLGMEmployeeSize,
//     website: globalState.startupLGMWebsite,
//     email: globalState.startupLGMEmail,
//     user_phone: globalState.startupLGMUP,
//     head_quarter: globalState.startupLGMHeadQuarterLocation,
//     facebook_link: globalState.startupLGMFacebookLink,
//     telegram_link: globalState.startupLGMFacebookLink,
//     youtube_link: globalState.startupLGMFacebookLink,
//     tiktok_link: globalState.startupLGMFacebookLink,
//     twitter_link: globalState.startupLGMFacebookLink,
//     linkedin: globalState.startupLGMFacebookLink,
//     other_link_one: globalState.startupLGMFacebookLink,
//     other_link_two: globalState.startupLGMFacebookLink,
//     other_link_three: globalState.startupLGMFacebookLink,
//     trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
//     rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
//     // rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
//     rep_letter_photo: null,
//     folder: 'entity',
//     origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
//   }
//   for (const key of Object.keys(payload)) {
//     if (payload[key])
//       formData.append(key, payload[key])
//   }

//   const { data } = await registerStartup(formData)
//   if (data) {
//     console.log(data);
//     ctx.reply("You have successfully registered your startup.", cancelKeyboard)
//   }

// }
export const confirmRegisterStartUpLGMHandler = async (ctx: any) => {
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupLGMName,
    founder: globalState.startupLGMFounderName,
    phone: globalState.startupLGMPhoneNumber,
    sector: globalState.startupLGMSectorID,
    is_user_gm: globalState.statupLGMIsUserGm,
    user_first_name: globalState.startupLGMUFN,
    user_last_name: globalState.startupLGMULN,
    employee_size: globalState.startupLGMEmployeeSize,
    website: globalState.startupLGMWebsite,
    email: globalState.startupLGMEmail,
    user_phone: globalState.startupLGMUP,
    head_quarter: globalState.startupLGMHeadQuarterLocation,
    facebook_link: globalState.startupLGMFacebookLink,
    telegram_link: globalState.startupLGMFacebookLink,
    youtube_link: globalState.startupLGMFacebookLink,
    tiktok_link: globalState.startupLGMFacebookLink,
    twitter_link: globalState.startupLGMFacebookLink,
    linkedin: globalState.startupLGMFacebookLink,
    other_link_one: globalState.startupLGMFacebookLink,
    other_link_two: globalState.startupLGMFacebookLink,
    other_link_three: globalState.startupLGMFacebookLink,
    trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }

  const { data } = await registerStartup(formData)
  if (data) {
    console.log(data);
    ctx.reply("You have successfully registered your startup.", cancelKeyboard)
  }
}



//licensed startup registration with General manager ends here...


//edit startup registeration with LGM starts here
export const editRegisterStartupLGMHandler = async (ctx: any) => {
     ctx.replyWithHTML("please choose which field to edit", registerStartupToBeEditFieldLGMKeyboard);
}

export const editRegisterStartupLGMCbActionHandler = async (ctx: any) => {
  console.log("initiating edit scene")
  const target = ctx.match[0].split(".")[0];
  ctx.scene.state.editTarget = target;
  ctx.session.editTarget = target
  ctx.scene.enter("startupRegisteringEditLGMScene")
}

export const startupRegisteringEditLGMInitHandler = async (ctx: any) => {
  const target = ctx.session.editTarget
    switch (target) {
        case "name":
            console.log("2")
            ctx.replyWithHTML("Please enter new name for your company", cancelKeyboard);
            return
        case "founderN1":
          ctx.replyWithHTML("please enter new name for Founder one.", cancelKeyboard);
          return
        case "founderN2":
          ctx.replyWithHTML("please enter new name for Founder two.", cancelKeyboard);
          return
        case "founderN3":
          ctx.replyWithHTML("please enter new name for Founder three.", cancelKeyboard);
          return
        case "founderN4":
          ctx.replyWithHTML("please enter new name for Founder four.", cancelKeyboard);
          return
        case "founderN5":
          ctx.replyWithHTML("please enter new name for Founder five.", cancelKeyboard);
          return
        case "employee":
        ctx.replyWithHTML("please enter new value for employee size.", cancelKeyboard);
        return  
        case "sector":
            const { data, error } = await fetchSectors()
            if (data) {
                const { sectors } = data;                
                let snames = sectors.map((nm: any) => nm.name);
                ctx.session.sectorNames = snames
                ctx.replyWithHTML("please enter industry sector.", {
                    reply_markup: JSON.stringify({
                        keyboard: snames.map((x: string, _: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        case "facebook":
          ctx.replyWithHTML("please enter new facebook link.", cancelKeyboard);
          return  
        case "telegram":
          ctx.replyWithHTML("please enter new telegram link.", cancelKeyboard);
          return  
        case "youtube":
          ctx.replyWithHTML("please enter new youtube link.", cancelKeyboard);
          return  
        case "tiktok":
          ctx.replyWithHTML("please enter new tiktok link.", cancelKeyboard);
          return  
        case "twitter":
          ctx.replyWithHTML("please enter new twitter link.", cancelKeyboard);
          return  
        case "linkedin":
          ctx.replyWithHTML("please enter new linkedin link.", cancelKeyboard);
          return  
        case "other1":
          ctx.replyWithHTML("please enter new other link one.", cancelKeyboard);
          return 
        case "other2":
          ctx.replyWithHTML("please enter new other link two.", cancelKeyboard);
          return 
        case "other3":
          ctx.replyWithHTML("please enter new other link three.", cancelKeyboard);
          return    
        case "phone":
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return
        case "website":
            ctx.replyWithHTML(`please enter website of your company.`, cancelKeyboard);
            return
        case "email":
            ctx.replyWithHTML(`please enter your company Email`, cancelKeyboard);
            return
        case "location":
            const res = await fetchCities()
            if (res.data) {
                const { cities } = res.data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                ctx.replyWithHTML("please enter location of your company head quarter.", {
                    reply_markup: JSON.stringify({
                        keyboard: cnames.map((x: string, _: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        default:
            break;
    }
}
 
export const startupRegisteringEditLGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"],async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
      // validate and update state
      switch (target) {
          case "name":
              globalState.startupLGMName = response
              ctx.reply("Name Updated")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;
          case "founderN1":
            globalState.startupLGMFounder1 = response
            ctx.replyWithHTML("Founder one Name Updated");
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return
          case "founderN2":
            globalState.startupLGMFounder2 = response
            ctx.replyWithHTML("Founder two Name Updated");
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return  
          case "founderN3":
            globalState.startupLGMFounder3 = response
            ctx.replyWithHTML("Founder three Name Updated");
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return  
          case "founderN4":
            globalState.startupLGMFounder4 = response
            ctx.replyWithHTML("Founder four Name Updated");
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return  
          case "founderN5":
            globalState.startupLGMFounder5 = response
            ctx.replyWithHTML("Founder five Name Updated");
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return               
          case "employee":
            globalState.startupLGMEmployeeSize = response
            ctx.replyWithHTML("Employee Size updated")
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            return      
          case "sector":
              globalState.startupLGMSectorName = response
              ctx.scene.state.startupLGMSectorName = response;
              const { data } = await fetchSector({ name: response })
              const { sectors } = data
              console.log(data)
              if (!sectors) {
                  ctx.replyWithHTML("please enter valid industry sector!", {
                      reply_markup: JSON.stringify({
                          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                              text: x,
                          }])), resize_keyboard: true, one_time_keyboard: true,
                      }),
                  })
                  return;
              } else {
                  let sectorId = sectors[0].id;
                  ctx.session.startupLGMSectorID = sectorId;
                  ctx.scene.state.startupLGMSectorID = sectorId;
                  ctx.reply("Sector Updated")
                  ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
                  break;
              }
          case "facebook":
            globalState.startupLGMFacebookLink = response
            ctx.replyWithHTML("facebook link updatee")
            ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
            break; 
            case "telegram":
              globalState.startupLGMTelegramLink = response
              ctx.replyWithHTML("telegram link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "youtube":
              globalState.startupLGMYouTubeLink = response
              ctx.replyWithHTML("youtube link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "twitter":
              globalState.startupLGMTwitterLink = response
              ctx.replyWithHTML("twitter link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "tiktok":
              globalState.startupLGMTikTokLink = response
              ctx.replyWithHTML("tiktok link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "linkedin":
              globalState.startupLGMLinkedInLink = response
              ctx.replyWithHTML("linkedin link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "other1":
              globalState.startupLGMOther1Link = response
              ctx.replyWithHTML("facebook link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "other2":
              globalState.startupLGMOtherLink2 = response
              ctx.replyWithHTML("facebook link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break; 
            case "other3":
              globalState.startupLGMOtherLink3 = response
              ctx.replyWithHTML("facebook link updatee")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;      
          case "phone":
              globalState.startupLGMPhoneNumber = response
              ctx.reply("Phone Updated")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;
          case "website":
              globalState.startupLGMWebsite = response
              ctx.reply("Website Updated")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;
          case "email":
              globalState.startupLGMEmail = response
              ctx.reply("updated")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;
          case "location":
              globalState.startupLGMHeadQuarterLocation = response
              ctx.scene.state.startupLGMHeadQuarterLocation
              const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
              const { cities } = res.data
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
                  ctx.session.startupLGMHeadQuarterLocation = hqId;
                  ctx.scene.state.startupLGMHeadQuarterLocation = hqId;
                  globalState = ctx.scene.state;
              }
              ctx.reply("Updated HeadQuarters")
              ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nnWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
              break;
      }
  }
})

//edit startup registeration with LGM ends here

//Unlicensed startup registration by General Manager handler  starts here.
export const startupUGMInitHandler = async (ctx: any) => {
  ctx.replyWithHTML('please enter the name of your startup', cancelKeyboard);
}
export const startupUGMNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMName = ctx.message.text;
    ctx.replyWithHTML(`please enter startup founder name`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter a valid startup G/M name!`, cancelKeyboard);
    return;
  }
})
export const startupUGMFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => { 
  if (ctx.message.text) {
    ctx.scene.state.startupUGMFounder2 = " "
    ctx.scene.state.startupUGMFounder3 = " "
    ctx.scene.state.startupUGMFounder4 = " "
    ctx.scene.state.startupUGMFounder5 = " "
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupUGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupUGMFounder${totalAddedFounders}`])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(`please enter startup founder name`, starupFounderKeyboard);
    } else {
      ctx.replyWithHTML(`please enter a valid startup fundar name !`, starupFounderKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup fundar name !`, starupFounderKeyboard);
    return;
  }
})

export const startupUGMTradeLicensePhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    console.log(ctx.update.message.photo[2].file_id);
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    console.log(downloadURL);
    const fname = `${ctx.from.id}.jpg`
    download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
      console.log("done")
      ctx.replyWithHTML(`please enter G/M id photo.`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
    return;
  }
})
export const startupUGMIdPhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/GMIdPhoto/${fname}`,).then(async () => {
      const { data, error } = await fetchSectors()
      if (data) {
        const { sectors } = data;
        let snames = sectors.map((nm: any) => nm.name);
        ctx.session.sectorNames = snames
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: snames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid G/M id photo!`, cancelKeyboard);
    return;
  }
})
export const startupUGMIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMSectorName = ctx.message.text;
    const { data, error } = await fetchSector({ name: ctx.scene.state.startupUGMSectorName })
    const { sectors } = data
    console.log(sectors.length, "bpt 1")
    if (!sectors.length) {
      ctx.replyWithHTML("please enter valid industry sector!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupUGMSectorID = sectorId;
      ctx.scene.state.startupUGMSectorID = sectorId;
      ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML("please enter valid industry sector!", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})
export const startupUGMEmployeeSizeHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmployeeSize = " ";
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupUGMEmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupUGMEmployeeSize);
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } 
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMWebsite = " ";
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMWebsite = ctx.message.text;
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMFacebookLink = " ";
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMFacebookLink = ctx.message.text;
      console.log(ctx.scene.state.startupUGMFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMTelegramLink = " ";
      console.log(ctx.scene.state.startupUGMTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMTelegramLink = ctx.message.text;
      console.log(ctx.scene.state.startupUGMTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMYouTubeLink = " ";
      console.log(ctx.scene.state.startupUGMYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMYouTubeLink = ctx.message.text;
      console.log(ctx.scene.state.startupUGMYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
    console.log(ctx.scene.state.startupUGMYouTubeLink);
    ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMTikTokLink = " ";
      console.log(ctx.scene.state.startupUGMTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMTikTokLink = ctx.message.text;
      console.log(ctx.scene.state.startupUGMTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMTwitterLink = " ";
      console.log(ctx.scene.state.startupUGMTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next()
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMTwitterLink = ctx.message.text;
      console.log(ctx.scene.state.startupUGMTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next()
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMOtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMOther1Link = " ";
      console.log(ctx.scene.state.startupUGMOther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMOther1Link = ctx.message.text;
      console.log(ctx.scene.state.startupUGMOther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMOtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMOther2Link = " ";
      console.log(ctx.scene.state.startupUGMOther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMOther2Link = ctx.message.text;
      console.log(ctx.scene.state.startupUGMOther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMOtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMOther3Link = " ";
      console.log(ctx.scene.state.startupUGMOther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMOther3Link = ctx.message.text;
      console.log(ctx.scene.state.startupUGMOther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmail = " ";
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      ctx.scene.state.startupUGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
  }
})
export const startupUGMOfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupUGMPhoneNumber = ctx.message.text;
    console.log(ctx.scene.state.startupUGMPhoneNumber);
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML("please enter location of your startup head quarter.", {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
    return;
  }
})
export const startupUGMHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMHeadQuarterLocation = ctx.message.text;
    const { data, error } = await fetchCity({ name: ctx.scene.state.startupUGMHeadQuarterLocation })
    const { cities } = data
    console.log(data, "bpt 1")
    if (!cities.length) {
      ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupUGMHeadQuarterLocation = hqId;
      ctx.scene.state.startupUGMHeadQuarterLocation = hqId;
      globalState = ctx.scene.state;
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
    }
  } else {
    ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})

export const confirmRegisteringStartupUGMActionHandler = async (ctx: any) => {
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupUGMName,
    founder: globalState.startupUGMFounder1,
    phone: globalState.startupUGMPhoneNumber,
    sector: globalState.startupUGMSectorID,
    is_user_gm: globalState.statupUGMIsUserGm,
    user_first_name: globalState.startupUGMUFN,
    user_last_name: globalState.startupUGMULN,
    employee_size: globalState.startupUGMEmployeeSize,
    website: globalState.startupUGMWebsite,
    email: globalState.startupUGMEmail,
    user_phone: globalState.startupUGMUP,
    head_quarter: globalState.startupUGMHeadQuarterLocation,
    facebook_link: globalState.startupUGMFacebookLink,
    telegram_link: globalState.startupUGMFacebookLink,
    youtube_link: globalState.startupUGMFacebookLink,
    tiktok_link: globalState.startupUGMFacebookLink,
    twitter_link: globalState.startupUGMFacebookLink,
    linkedin: globalState.startupUGMFacebookLink,
    other_link_one: globalState.startupUGMFacebookLink,
    other_link_two: globalState.startupUGMFacebookLink,
    other_link_three: globalState.startupUGMFacebookLink,
    trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }

  const { data } = await registerStartup(formData)
  if (data) {
    console.log(data);
    ctx.reply("You have successfully registered your startup.", cancelKeyboard)
  }

}
export const confirmRegisterStartUpUGMHandler = async (ctx: any) => {
  const formData = new FormData();
  const payload: any = {
    name: globalState.startupUGMName,
    founder: globalState.startupUGMFounderName,
    phone: globalState.startupUGMPhoneNumber,
    sector: globalState.startupUGMSectorID,
    is_user_gm: globalState.statupUGMIsUserGm,
    user_first_name: globalState.startupUGMUFN,
    user_last_name: globalState.startupUGMULN,
    employee_size: globalState.startupUGMEmployeeSize,
    website: globalState.startupUGMWebsite,
    email: globalState.startupUGMEmail,
    user_phone: globalState.startupUGMUP,
    head_quarter: globalState.startupUGMHeadQuarterLocation,
    facebook_link: globalState.startupUGMFacebookLink,
    telegram_link: globalState.startupUGMFacebookLink,
    youtube_link: globalState.startupUGMFacebookLink,
    tiktok_link: globalState.startupUGMFacebookLink,
    twitter_link: globalState.startupUGMFacebookLink,
    linkedin: globalState.startupUGMFacebookLink,
    other_link_one: globalState.startupUGMFacebookLink,
    other_link_two: globalState.startupUGMFacebookLink,
    other_link_three: globalState.startupUGMFacebookLink,
    trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    folder: 'entity',
    origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }

  const { data } = await registerStartup(formData)
  if (data) {
    console.log(data);
    ctx.reply("You have successfully registered your startup.", cancelKeyboard)
  }
}

//Unicensed startup registration with General manager endes here...


//edit startup registeration with UGM starts here

export const editRegisterStartupUGMHandler = async (ctx: any) => {
  ctx.replyWithHTML("please choose which field to edit", registerStartupToBeEditFieldUGMKeyboard);
}
export const editRegisterStartupUGMCbActionHandler = async (ctx: any) => {
console.log("initiating edit scene")
const target = ctx.match[0].split(".")[0];
ctx.scene.state.editTarget = target;
ctx.session.editTarget = target
return ctx.scene.enter("startupRegisteringEditUGMScene")
}

export const startupRegisteringEditUGMInitHandler = async (ctx: any) => {
const target = ctx.session.editTarget
 switch (target) {
     case "name":
         console.log("2")
         ctx.replyWithHTML("Please enter new name for your company", cancelKeyboard);
         return
     case "founderN1":
       ctx.replyWithHTML("please enter new name for Founder one.", cancelKeyboard);
       return
     case "founderN2":
       ctx.replyWithHTML("please enter new name for Founder two.", cancelKeyboard);
       return
     case "founderN3":
       ctx.replyWithHTML("please enter new name for Founder three.", cancelKeyboard);
       return
     case "founderN4":
       ctx.replyWithHTML("please enter new name for Founder four.", cancelKeyboard);
       return
     case "founderN5":
       ctx.replyWithHTML("please enter new name for Founder five.", cancelKeyboard);
       return
     case "employee":
     ctx.replyWithHTML("please enter new value for employee size.", cancelKeyboard);
     return  
     case "sector":
         const { data, error } = await fetchSectors()
         if (data) {
             const { sectors } = data;                
             let snames = sectors.map((nm: any) => nm.name);
             ctx.session.sectorNames = snames
             ctx.replyWithHTML("please enter industry sector.", {
                 reply_markup: JSON.stringify({
                     keyboard: snames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     case "facebook":
       ctx.replyWithHTML("please enter new facebook link.", cancelKeyboard);
       return  
     case "telegram":
       ctx.replyWithHTML("please enter new telegram link.", cancelKeyboard);
       return  
     case "youtube":
       ctx.replyWithHTML("please enter new youtube link.", cancelKeyboard);
       return  
     case "tiktok":
       ctx.replyWithHTML("please enter new tiktok link.", cancelKeyboard);
       return  
     case "twitter":
       ctx.replyWithHTML("please enter new twitter link.", cancelKeyboard);
       return  
     case "linkedin":
       ctx.replyWithHTML("please enter new linkedin link.", cancelKeyboard);
       return  
     case "other1":
       ctx.replyWithHTML("please enter new other link one.", cancelKeyboard);
       return 
     case "other2":
       ctx.replyWithHTML("please enter new other link two.", cancelKeyboard);
       return 
     case "other3":
       ctx.replyWithHTML("please enter new other link three.", cancelKeyboard);
       return    
     case "phone":
         ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
         return
     case "website":
         ctx.replyWithHTML(`please enter website of your company.`, cancelKeyboard);
         return
     case "email":
         ctx.replyWithHTML(`please enter your company Email`, cancelKeyboard);
         return
     case "location":
         const res = await fetchCities()
         if (res.data) {
             const { cities } = res.data;
             let cnames = cities.map((nm: any) => nm.name);
             ctx.session.cityNames = cnames
             ctx.replyWithHTML("please enter location of your company head quarter.", {
                 reply_markup: JSON.stringify({
                     keyboard: cnames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     default:
         break;
 }
}

export const startupRegisteringEditUGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"],async (ctx: any) => {

const response = ctx.message.text
const target = ctx.session.editTarget
console.log(response, target, "dawg")
if (response) {
   // validate and update state
   switch (target) {
       case "name":
           globalState.startupUGMName = response
           ctx.reply("Name Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;
       case "founderN1":
         globalState.startupUGMFounder1 = response
         ctx.replyWithHTML("Founder one Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return
       case "founderN2":
         globalState.startupUGMFounder2 = response
         ctx.replyWithHTML("Founder two Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return  
       case "founderN3":
         globalState.startupUGMFounder3 = response
         ctx.replyWithHTML("Founder three Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return  
       case "founderN4":
         globalState.startupUGMFounder4 = response
         ctx.replyWithHTML("Founder four Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return  
       case "founderN5":
         globalState.startupUGMFounder5 = response
         ctx.replyWithHTML("Founder five Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return               
       case "employee":
         globalState.startupUGMEmployeeSize = response
         ctx.replyWithHTML("Employee Size updated")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         return      
       case "sector":
           globalState.startupUGMSectorName = response
           ctx.scene.state.startupUGMSectorName = response;
           const { data } = await fetchSector({ name: response })
           const { sectors } = data
           console.log(data)
           if (!sectors) {
               ctx.replyWithHTML("please enter valid industry sector!", {
                   reply_markup: JSON.stringify({
                       keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                           text: x,
                       }])), resize_keyboard: true, one_time_keyboard: true,
                   }),
               })
               return;
           } else {
               let sectorId = sectors[0].id;
               ctx.session.startupUGMSectorID = sectorId;
               ctx.scene.state.startupUGMSectorID = sectorId;
               ctx.reply("Sector Updated")
               ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
               break;
           }
       case "facebook":
         globalState.startupUGMFacebookLink = response
         ctx.replyWithHTML("facebook link updatee")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
         break; 
         case "telegram":
           globalState.startupUGMTelegramLink = response
           ctx.replyWithHTML("telegram link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "youtube":
           globalState.startupUGMYouTubeLink = response
           ctx.replyWithHTML("youtube link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "twitter":
           globalState.startupUGMTwitterLink = response
           ctx.replyWithHTML("twitter link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "tiktok":
           globalState.startupUGMTikTokLink = response
           ctx.replyWithHTML("tiktok link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "linkedin":
           globalState.startupUGMLinkedInLink = response
           ctx.replyWithHTML("linkedin link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "other1":
           globalState.startupUGMOther1Link = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "other2":
           globalState.startupUGMOtherLink2 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break; 
         case "other3":
           globalState.startupUGMOtherLink3 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;      
       case "phone":
           globalState.startupUGMPhoneNumber = response
           ctx.reply("Phone Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;
       case "website":
           globalState.startupUGMWebsite = response
           ctx.reply("Website Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;
       case "email":
           globalState.startupUGMEmail = response
           ctx.reply("updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;
       case "sector":
           globalState.startupUGMHeadQuarterLocation = response
           ctx.scene.state.startupUGMHeadQuarterLocation
           const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
           const { cities } = res.data
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
               ctx.session.startupUGMHeadQuarterLocation = hqId;
               ctx.scene.state.startupUGMHeadQuarterLocation = hqId;
               globalState = ctx.scene.state;
           }
           ctx.reply("Updated HeadQuarters")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nFounder2: ${globalState.startupUGMFounder2}\nFounder3: ${globalState.startupUGMFounder3}\nFounder4: ${globalState.startupUGMFounder4}\nFounder5: ${globalState.startupUGMFounder5}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nEmployee Size: ${globalState.startupUGMEmployeeSize}\nnWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}\nFacebook link: ${globalState.startupUGMFacebookLink}\nTelegram link: ${globalState.startupUGMTelegramLink}\nYouTube link: ${globalState.startupUGMYouTubeLink}\nTikTok link: ${globalState.startupUGMTikTokLink}\nTwitter link: ${globalState.startupUGMTwitterLink}\nOther link1: ${globalState.startupUGMOther1Link}\nOther link2: ${globalState.startupUGMOther2Link}\nOther link3: ${globalState.startupUGMOther3Link}`, registerStartupConfirmUGMKeyboard)
           break;
   }
}
})
//edit startup registeration with UGM ends here


//licensed startup registraion with Representative starts here...
export const startupLRInitHandler = (ctx: any) => {
  ctx.replyWithHTML("please enter the name of your startup.", cancelKeyboard)
}
export const startupLRNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRName = ctx.message.text;
    ctx.replyWithHTML(`please enter startup founders name`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter a valid startup G/M name!`, cancelKeyboard);
    return;
  }
})
export const startupLRFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRFounder2 = " "
    ctx.scene.state.startupLRFounder3 = " "
    ctx.scene.state.startupLRFounder4 = " "
    ctx.scene.state.startupLRFounder5 = " "
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupLRFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupLRFounder${totalAddedFounders}`]);
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
        return ctx.wizard.next();
      } else {
        ctx.replyWithHTML(`please enter other founder name. `, starupFounderKeyboard);
      }
    } else {
      ctx.replyWithHTML(`please enter a valid startup fundar name!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup fundar name!`, startupRegisterOptionalKeyboard);
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
      ctx.replyWithHTML(`please enter G/M id photo.`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML(`please enter G/M id photo.`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(` please enter valid trade licence photo!`, startupRegisterOptionalKeyboard);
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
      ctx.replyWithHTML(`please enter Representative stamped letter`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid G/M id photo!`, cancelKeyboard);
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
      const { data, error } = await fetchSectors()
      if (data) {
        const { sectors } = data;
        let snames = sectors.map((nm: any) => nm.name);
        ctx.session.sectorNames = snames
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: ctx.session.sectorNames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`please enter a valid Stamped letter photo!`, cancelKeyboard);
  }
})
export const startupLRIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupLRSectorName = ctx.message.text;
    const { data, error } = await fetchSector({ name: ctx.scene.state.startupLRSectorName })
    const { sectors } = data
    console.log(sectors.length)
    if (!sectors.length) {
      ctx.replyWithHTML("please enter valid industry sector!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupLRSectorID = sectorId;
      ctx.scene.state.startupLRSectorID = sectorId;
      ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML("please enter valid industry sector!", {
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
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupLREmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupLREmployeeSize);
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRWebsite = " ";
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRWebsite = ctx.message.text;
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRFacebookLink = " ";
      console.log(ctx.scene.state.startupLRFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if ((vw(ctx.message.text))) {
      ctx.scene.state.startupLRFacebookLink = ctx.message.text;
      console.log(ctx.scene.state.startupLRFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTelegramLink = " ";
      console.log(ctx.scene.state.startupLRTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRTelegramLink = ctx.message.text;
      console.log(ctx.scene.state.startupLRTelegramLink);
      ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRYouTubeLink = " ";
      console.log(ctx.scene.state.startupLRYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRYouTubeLink = ctx.message.text;
      console.log(ctx.scene.state.startupLRYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTikTokLink = " ";
      console.log(ctx.scene.state.startupLRTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRTikTokLink = ctx.message.text;
      console.log(ctx.scene.state.startupLRTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTwitterLink = " ";
      console.log(ctx.scene.state.startupLRTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRTwitterLink = ctx.message.text;
      console.log(ctx.scene.state.startupLRTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther1Link = " ";
      console.log(ctx.scene.state.startupLROther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLROther1Link = ctx.message.text;
      console.log(ctx.scene.state.startupLROther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther2Link = " ";
      console.log(ctx.scene.state.startupLROther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLROther2Link = ctx.message.text;
      console.log(ctx.scene.state.startupLROther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther3Link = " ";
      console.log(ctx.scene.state.startupLROther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLROther3Link = ctx.message.text;
      console.log(ctx.scene.state.startupLROther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLREmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLREmail = " ";
      console.log(ctx.scene.state.startupLREmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      ctx.scene.state.startupLREmail = ctx.message.text;
      console.log(ctx.scene.state.startupLREmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
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
      ctx.replyWithHTML("please enter location of your startup head quarter.", {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
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
      ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      ctx.session.startupLRHeadQuarterLocation = hqId;
      ctx.scene.state.startupLRHeadQuarterLocation = hqId;
      globalState = ctx.scene.state
      console.log("****************************************************")
      console.log(globalState)
      console.log("****************************************************")
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterL}\nOther link: ${globalState.startupLROther1Link}`, registerStartupConfirmLRKeyboard)
      // Finish line
      ctx.reply("Finished here is your info please approve")
      ctx.scene.leave()
    }
  } else {
    ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
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
  const formData = new FormData()
  const payload: any = {
    'name': globalState.startupLRName,
    'founder': globalState.startupLRFounderName,
    'phone': globalState.startupLRPhoneNumber,
    'sector': globalState.startupLRSectorID,
    'is_user_gm': globalState.statupLRIsUserGm,
    'user_first_name': globalState.startupLRUFN,
    'user_last_name': globalState.startupLRULN,
    'employee_size': globalState.startupLREmployeeSize,
    'website': globalState.startupLRWebsite,
    'email': globalState.startupLREmail,
    'user_phone': globalState.startupLRUP,
    'head_quarter': globalState.startupLRHeadQuarterLocation,
    'facebook_link': globalState.startupLRFacebookLink,
    'telegram_link': globalState.startupLRFacebookLink,
    'youtube_link': globalState.startupLRFacebookLink,
    'tiktok_link': globalState.startupLRFacebookLink,
    'twitter_link': globalState.startupLRFacebookLink,
    'linkedin': globalState.startupLRFacebookLink,
    'other_link_one': globalState.startupLRFacebookLink,
    'other_link_two': globalState.startupLRFacebookLink,
    'other_link_three': globalState.startupLRFacebookLink,
    'trade_license_photo': fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    'rep_id_photo': fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    'rep_letter_photo': fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    'folder': 'entity',
    'origin_platform_id': '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }

  const { data } = await registerStartup(formData)
  if (data) {
    console.log(data);
    ctx.reply("You have successfully registered your startup.", cancelKeyboard)
  }
}
//licensed startup registration with representative ends here...


//edit startup registeration with LR starts here

export const editRegisterStartupLRHandler = async (ctx: any) => {
  ctx.replyWithHTML("please choose which field to edit", registerStartupToBeEditFieldLRKeyboard);
}
export const editRegisterStartupLRCbActionHandler = async (ctx: any) => {
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
         ctx.replyWithHTML("Please enter new name for your company", cancelKeyboard);
         return
     case "founderN1":
       ctx.replyWithHTML("please enter new name for Founder one.", cancelKeyboard);
       return
     case "founderN2":
       ctx.replyWithHTML("please enter new name for Founder two.", cancelKeyboard);
       return
     case "founderN3":
       ctx.replyWithHTML("please enter new name for Founder three.", cancelKeyboard);
       return
     case "founderN4":
       ctx.replyWithHTML("please enter new name for Founder four.", cancelKeyboard);
       return
     case "founderN5":
       ctx.replyWithHTML("please enter new name for Founder five.", cancelKeyboard);
       return
     case "employee":
     ctx.replyWithHTML("please enter new value for employee size.", cancelKeyboard);
     return  
     case "sector":
         const { data, error } = await fetchSectors()
         if (data) {
             const { sectors } = data;                
             let snames = sectors.map((nm: any) => nm.name);
             ctx.session.sectorNames = snames
             ctx.replyWithHTML("please enter industry sector.", {
                 reply_markup: JSON.stringify({
                     keyboard: snames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     case "facebook":
       ctx.replyWithHTML("please enter new facebook link.", cancelKeyboard);
       return  
     case "telegram":
       ctx.replyWithHTML("please enter new telegram link.", cancelKeyboard);
       return  
     case "youtube":
       ctx.replyWithHTML("please enter new youtube link.", cancelKeyboard);
       return  
     case "tiktok":
       ctx.replyWithHTML("please enter new tiktok link.", cancelKeyboard);
       return  
     case "twitter":
       ctx.replyWithHTML("please enter new twitter link.", cancelKeyboard);
       return  
     case "linkedin":
       ctx.replyWithHTML("please enter new linkedin link.", cancelKeyboard);
       return  
     case "other1":
       ctx.replyWithHTML("please enter new other link one.", cancelKeyboard);
       return 
     case "other2":
       ctx.replyWithHTML("please enter new other link two.", cancelKeyboard);
       return 
     case "other3":
       ctx.replyWithHTML("please enter new other link three.", cancelKeyboard);
       return    
     case "phone":
         ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
         return
     case "website":
         ctx.replyWithHTML(`please enter website of your company.`, cancelKeyboard);
         return
     case "email":
         ctx.replyWithHTML(`please enter your company Email`, cancelKeyboard);
         return
     case "location":
         const res = await fetchCities()
         if (res.data) {
             const { cities } = res.data;
             let cnames = cities.map((nm: any) => nm.name);
             ctx.session.cityNames = cnames
             ctx.replyWithHTML("please enter location of your company head quarter.", {
                 reply_markup: JSON.stringify({
                     keyboard: cnames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     default:
         break;
 }
}

export const startupRegisteringEditLRValueHandler = Telegraf.on(["photo", "text", "contact", "document"],async (ctx: any) => {

const response = ctx.message.text
const target = ctx.session.editTarget
console.log(response, target, "dawg")
if (response) {
   // validate and update state
   switch (target) {
       case "name":
           globalState.startupLRName = response
           ctx.reply("Name Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;
       case "founderN1":
         globalState.startupLRFounder1 = response
         ctx.replyWithHTML("Founder one Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return
       case "founderN2":
         globalState.startupLRFounder2 = response
         ctx.replyWithHTML("Founder two Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return  
       case "founderN3":
         globalState.startupLRFounder3 = response
         ctx.replyWithHTML("Founder three Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return  
       case "founderN4":
         globalState.startupLRFounder4 = response
         ctx.replyWithHTML("Founder four Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return  
       case "founderN5":
         globalState.startupLRFounder5 = response
         ctx.replyWithHTML("Founder five Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return               
       case "employee":
         globalState.startupLREmployeeSize = response
         ctx.replyWithHTML("Employee Size updated")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         return      
       case "sector":
           globalState.startupLRSectorName = response
           ctx.scene.state.startupLRSectorName = response;
           const { data } = await fetchSector({ name: response })
           const { sectors } = data
           console.log(data)
           if (!sectors) {
               ctx.replyWithHTML("please enter valid industry sector!", {
                   reply_markup: JSON.stringify({
                       keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                           text: x,
                       }])), resize_keyboard: true, one_time_keyboard: true,
                   }),
               })
               return;
           } else {
               let sectorId = sectors[0].id;
               ctx.session.startupLRSectorID = sectorId;
               ctx.scene.state.startupLRSectorID = sectorId;
               ctx.reply("Sector Updated")
               ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
               break;
           }
       case "facebook":
         globalState.startupLRFacebookLink = response
         ctx.replyWithHTML("facebook link updatee")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
         break; 
         case "telegram":
           globalState.startupLRTelegramLink = response
           ctx.replyWithHTML("telegram link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "youtube":
           globalState.startupLRYouTubeLink = response
           ctx.replyWithHTML("youtube link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "twitter":
           globalState.startupLRTwitterLink = response
           ctx.replyWithHTML("twitter link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "tiktok":
           globalState.startupLRTikTokLink = response
           ctx.replyWithHTML("tiktok link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "linkedin":
           globalState.startupLRLinkedInLink = response
           ctx.replyWithHTML("linkedin link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "other1":
           globalState.startupLROther1Link = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "other2":
           globalState.startupLROtherLink2 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break; 
         case "other3":
           globalState.startupLROtherLink3 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;      
       case "phone":
           globalState.startupLRPhoneNumber = response
           ctx.reply("Phone Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;
       case "website":
           globalState.startupLRWebsite = response
           ctx.reply("Website Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;
       case "email":
           globalState.startupLREmail = response
           ctx.reply("updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;
       case "sector":
           globalState.startupLRHeadQuarterLocation = response
           ctx.scene.state.startupLRHeadQuarterLocation
           const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
           const { cities } = res.data
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
               ctx.session.startupLRHeadQuarterLocation = hqId;
               ctx.scene.state.startupLRHeadQuarterLocation = hqId;
               globalState = ctx.scene.state;
           }
           ctx.reply("Updated HeadQuarters")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName}\nFounder1: ${globalState.startupLRFounder1}\nFounder2: ${globalState.startupLRFounder2}\nFounder3: ${globalState.startupLRFounder3}\nFounder4: ${globalState.startupLRFounder4}\nFounder5: ${globalState.startupLRFounder5}\nPhone: ${globalState.startupLRPhoneNumber}\nSector: ${globalState.startupLRSectorName}\nEmployee Size: ${globalState.startupLREmployeeSize}\nnWebsite: ${globalState.startupLRWebsite}\nEmail: ${globalState.startupLREmail}\nFacebook link: ${globalState.startupLRFacebookLink}\nTelegram link: ${globalState.startupLRTelegramLink}\nYouTube link: ${globalState.startupLRYouTubeLink}\nTikTok link: ${globalState.startupLRTikTokLink}\nTwitter link: ${globalState.startupLRTwitterLink}\nOther link1: ${globalState.startupLROther1Link}\nOther link2: ${globalState.startupLROther2Link}\nOther link3: ${globalState.startupLROther3Link}`, registerStartupConfirmLRKeyboard)
           break;
   }
}
})
//edit startup registeration with LR ends here



//unlicensed startup registration with Representative starts 
export const startupURInitHandler = async (ctx: any) => {
  ctx.replyWithHTML("please enter the name of your startup", cancelKeyboard);
}
export const startupURNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupURName = ctx.message.text;
    ctx.replyWithHTML("please enter founder name of your startup", cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML("please enter valid startup name!");
    return;
  }
})
export const startupURFoundersNameHandler = Telegraf.on(["photo", "text", "contact", "document"], (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupURFounder2 = " "
    ctx.scene.state.startupURFounder3 = " "
    ctx.scene.state.startupURFounder4 = " "
    ctx.scene.state.startupURFounder5 = " "
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML("please enter startup trade license photo", startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupURFounder${totalAddedFounders}`] = ctx.message.text;
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML("please enter startup trade license photo", startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
      }
      // increment total founders added
      ctx.replyWithHTML("please enter another founder name", starupFounderKeyboard);
      return;
    } else {
      ctx.replyWithHTML("please enter valid founder name!", starupFounderKeyboard);
      return;
    }
    // return ctx.wizard.next();
  } else {
    ctx.replyWithHTML("please enter valid founder name!", starupFounderKeyboard);
    return;
  }
})

export const startupURTradeLicensePhoto = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML("please enter representative id photo", cancelKeyboard);
    return ctx.wizard.next();
  } else if (ctx.update.message.photo) {
    console.log(ctx.update.message.photo[2].file_id);
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    console.log(downloadURL);
    const fname = `${ctx.from.id}.jpg`
    download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
      ctx.replyWithHTML(`please enter G/M id photo.`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML(`please enter representative id photo`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(` please enter valid trade licence photo!`, startupRegisterOptionalKeyboard);
    return
  }
})
export const startupUPIdphotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML("please enter stamped letter photo", startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/GMIdPhoto/${fname}`,).then(async () => {
      ctx.replyWithHTML(`please enter Representative stamped letter`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid G/M id photo!`, cancelKeyboard);
    return;
  }
})
export const startupURStampedLetterHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML("please enter employee size of your startup", startupRegisterOptionalKeyboard)
    return ctx.wizard.next();
  } else if (ctx.update.message.photo) {
    ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
    console.log(ctx.scene.state.startupIdPhoto);
    const fname = `${ctx.from.id}.jpg`
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    download(downloadURL, `files/letterPhoto/${fname}`,).then(async () => {
      const { data, error } = await fetchSectors()
      if (data) {
        const { sectors } = data;
        let snames = sectors.map((nm: any) => nm.name);
        ctx.session.sectorNames = snames
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: ctx.session.sectorNames.map((x: string, _: string) => ([{
              text: x,
            }])), resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`please enter a valid Stamped letter photo!`, cancelKeyboard);
  }
})
export const startupURIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupURSectorName = ctx.message.text;
    const { data, error } = await fetchSector({ name: ctx.scene.state.startupURSectorName })
    const { sectors } = data
    console.log(sectors.length)
    if (!sectors.length) {
      ctx.replyWithHTML("please enter valid industry sector!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let sectorId = sectors[0].id;
      console.log("bpt 2", sectorId)
      ctx.session.startupURSectorID = sectorId;
      ctx.scene.state.startupURSectorID = sectorId;
      ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML("please enter valid industry sector!", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
})
export const startupUREmployeeSizeHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUREmployeeSize = " ";
      console.log(ctx.scene.state.startupUREmployeeSize);
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.scene.state.startupUREmployeeSize = ctx.message.text;
      console.log(ctx.scene.state.startupUREmployeeSize);
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURWebsite = " ";
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupURWebsite = ctx.message.text;
      ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURFacebookLink = " ";
      console.log(ctx.scene.state.startupURFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupURFacebookLink = ctx.message.text;
      console.log(ctx.scene.state.startupURFacebookLink);
      ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURTelegramLink = " ";
    } else {
      ctx.scene.state.startupURTelegramLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupURTelegramLink);
    ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURYouTubeLink = " ";
      console.log(ctx.scene.state.startupURYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupURYouTubeLink = ctx.message.text;
      console.log(ctx.scene.state.startupURYouTubeLink);
      ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURTikTokLink = " ";
      console.log(ctx.scene.state.startupURTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupURTikTokLink = ctx.message.text;
      console.log(ctx.scene.state.startupURTikTokLink);
      ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURTwitterLink = " ";
      console.log(ctx.scene.state.startupURTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupURTwitterLink = ctx.message.text;
      console.log(ctx.scene.state.startupURTwitterLink);
      ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther1Link = " ";
      console.log(ctx.scene.state.startupUROther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUROther1Link = ctx.message.text;
      console.log(ctx.scene.state.startupUROther1Link);
      ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther2Link = " ";
      console.log(ctx.scene.state.startupUROther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUROther2Link = ctx.message.text;
      console.log(ctx.scene.state.startupUROther2Link);
      ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter other link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther3Link = " ";
      console.log(ctx.scene.state.startupUROther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUROther3Link = ctx.message.text;
      console.log(ctx.scene.state.startupUROther3Link);
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUREmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUREmail = " ";
      console.log(ctx.scene.state.startupUREmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      ctx.scene.state.startupUREmail = ctx.message.text;
      console.log(ctx.scene.state.startupUREmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupURPhoneNumber = ctx.message.text;
    console.log(ctx.scene.state.startupURPhoneNumber);
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML("please enter location of your startup head quarter.", {
        reply_markup: JSON.stringify({
          keyboard: cnames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
    return;
  }
})
export const startupURHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupURHeadQuarterLocation = ctx.message.text;
    const { data, error } = await fetchCity({ name: ctx.scene.state.startupURHeadQuarterLocation })
    const { cities } = data
    console.log(cities, "bpt 1")
    if (!cities.length) {
      ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
      return;
    } else {
      let hqId = cities[0].id;
      console.log("bpt 2", hqId)
      ctx.session.startupURHeadQuarterLocation = hqId;
      ctx.scene.state.startupURHeadQuarterLocation = hqId;
      globalState = ctx.scene.state
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link: ${globalState.startupUROther1Link}`, registerStartupConfirmURKeyboard)
      ctx.reply("Finished here is your info please approve")
      ctx.scene.leave()
    }
  } else {
    ctx.replyWithHTML("Please enter a valid location of your startup head quarter!", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    })
    return;
  }
});
export const confirmRegisterStartUpURHandler = async (ctx: any) => {
  const formData = new FormData()
  const payload: any = {
    'name': globalState.startupURName,
    'founder': globalState.startupURFounderName,
    'phone': globalState.startupURPhoneNumber,
    'sector': globalState.startupURSectorID,
    'is_user_gm': globalState.statupURIsUserGm,
    'user_first_name': globalState.startupURUFN,
    'user_last_name': globalState.startupURULN,
    'employee_size': globalState.startupUREmployeeSize,
    'website': globalState.startupURWebsite,
    'email': globalState.startupUREmail,
    'user_phone': globalState.startupURUP,
    'head_quarter': globalState.startupURHeadQuarterLocation,
    'facebook_link': globalState.startupURFacebookLink,
    'telegram_link': globalState.startupURFacebookLink,
    'youtube_link': globalState.startupURFacebookLink,
    'tiktok_link': globalState.startupURFacebookLink,
    'twitter_link': globalState.startupURFacebookLink,
    'linkedin': globalState.startupURFacebookLink,
    'other_link_one': globalState.startupURFacebookLink,
    'other_link_two': globalState.startupURFacebookLink,
    'other_link_three': globalState.startupURFacebookLink,
    'trade_license_photo': fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
    'rep_id_photo': fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
    'rep_letter_photo': fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    'folder': 'entity',
    'origin_platform_id': '941cc536-5cd3-44a1-8fca-5f898f26aba5',
  }
  
  for (const key of Object.keys(payload)) {
    if (payload[key])
      formData.append(key, payload[key])
  }

  const { data } = await registerStartup(formData)
  if (data) {
    console.log(data);
    ctx.reply("You have successfully registered your startup.", cancelKeyboard)
  }

}

export const editRegisterStartUpURHandler = async (ctx: any) => {

}

//unlicensed startup registraiton with representative ends here...



//edit startup registeration with UR starts here

export const editRegisterStartupURHandler = async (ctx: any) => {
  ctx.replyWithHTML("please choose which field to edit", registerStartupToBeEditFieldURKeyboard);
}
export const editRegisterStartupURCbActionHandler = async (ctx: any) => {
console.log("initiating edit scene")
const target = ctx.match[0].split(".")[0];
ctx.scene.state.editTarget = target;
ctx.session.editTarget = target
return ctx.scene.enter("startupRegisteringEditURScene")
}

export const startupRegisteringEditURInitHandler = async (ctx: any) => {
const target = ctx.session.editTarget
 switch (target) {
     case "name":
         console.log("2")
         ctx.replyWithHTML("Please enter new name for your company", cancelKeyboard);
         return
     case "founderN1":
       ctx.replyWithHTML("please enter new name for Founder one.", cancelKeyboard);
       return
     case "founderN2":
       ctx.replyWithHTML("please enter new name for Founder two.", cancelKeyboard);
       return
     case "founderN3":
       ctx.replyWithHTML("please enter new name for Founder three.", cancelKeyboard);
       return
     case "founderN4":
       ctx.replyWithHTML("please enter new name for Founder four.", cancelKeyboard);
       return
     case "founderN5":
       ctx.replyWithHTML("please enter new name for Founder five.", cancelKeyboard);
       return
     case "employee":
     ctx.replyWithHTML("please enter new value for employee size.", cancelKeyboard);
     return  
     case "sector":
         const { data, error } = await fetchSectors()
         if (data) {
             const { sectors } = data;                
             let snames = sectors.map((nm: any) => nm.name);
             ctx.session.sectorNames = snames
             ctx.replyWithHTML("please enter industry sector.", {
                 reply_markup: JSON.stringify({
                     keyboard: snames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     case "facebook":
       ctx.replyWithHTML("please enter new facebook link.", cancelKeyboard);
       return  
     case "telegram":
       ctx.replyWithHTML("please enter new telegram link.", cancelKeyboard);
       return  
     case "youtube":
       ctx.replyWithHTML("please enter new youtube link.", cancelKeyboard);
       return  
     case "tiktok":
       ctx.replyWithHTML("please enter new tiktok link.", cancelKeyboard);
       return  
     case "twitter":
       ctx.replyWithHTML("please enter new twitter link.", cancelKeyboard);
       return  
     case "linkedin":
       ctx.replyWithHTML("please enter new linkedin link.", cancelKeyboard);
       return  
     case "other1":
       ctx.replyWithHTML("please enter new other link one.", cancelKeyboard);
       return 
     case "other2":
       ctx.replyWithHTML("please enter new other link two.", cancelKeyboard);
       return 
     case "other3":
       ctx.replyWithHTML("please enter new other link three.", cancelKeyboard);
       return    
     case "phone":
         ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
         return
     case "website":
         ctx.replyWithHTML(`please enter website of your company.`, cancelKeyboard);
         return
     case "email":
         ctx.replyWithHTML(`please enter your company Email`, cancelKeyboard);
         return
     case "location":
         const res = await fetchCities()
         if (res.data) {
             const { cities } = res.data;
             let cnames = cities.map((nm: any) => nm.name);
             ctx.session.cityNames = cnames
             ctx.replyWithHTML("please enter location of your company head quarter.", {
                 reply_markup: JSON.stringify({
                     keyboard: cnames.map((x: string, _: string) => ([{
                         text: x,
                     }])), resize_keyboard: true, one_time_keyboard: true,
                 }),
             })
         }
         return
     default:
         break;
 }
}

export const startupRegisteringEditURValueHandler = Telegraf.on(["photo", "text", "contact", "document"],async (ctx: any) => {

const response = ctx.message.text
const target = ctx.session.editTarget
console.log(response, target, "dawg")
if (response) {
   // validate and update state
   switch (target) {
       case "name":
           globalState.startupURName = response
           ctx.reply("Name Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;
       case "founderN1":
         globalState.startupURFounder1 = response
         ctx.replyWithHTML("Founder one Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return
       case "founderN2":
         globalState.startupURFounder2 = response
         ctx.replyWithHTML("Founder two Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return  
       case "founderN3":
         globalState.startupURFounder3 = response
         ctx.replyWithHTML("Founder three Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return  
       case "founderN4":
         globalState.startupURFounder4 = response
         ctx.replyWithHTML("Founder four Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return  
       case "founderN5":
         globalState.startupURFounder5 = response
         ctx.replyWithHTML("Founder five Name Updated");
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return               
       case "employee":
         globalState.startupUREmployeeSize = response
         ctx.replyWithHTML("Employee Size updated")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         return      
       case "sector":
           globalState.startupURSectorName = response
           ctx.scene.state.startupURSectorName = response;
           const { data } = await fetchSector({ name: response })
           const { sectors } = data
           console.log(data)
           if (!sectors) {
               ctx.replyWithHTML("please enter valid industry sector!", {
                   reply_markup: JSON.stringify({
                       keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                           text: x,
                       }])), resize_keyboard: true, one_time_keyboard: true,
                   }),
               })
               return;
           } else {
               let sectorId = sectors[0].id;
               ctx.session.startupURSectorID = sectorId;
               ctx.scene.state.startupURSectorID = sectorId;
               ctx.reply("Sector Updated")
               ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
               break;
           }
       case "facebook":
         globalState.startupURFacebookLink = response
         ctx.replyWithHTML("facebook link updatee")
         ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
         break; 
         case "telegram":
           globalState.startupURTelegramLink = response
           ctx.replyWithHTML("telegram link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "youtube":
           globalState.startupURYouTubeLink = response
           ctx.replyWithHTML("youtube link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "twitter":
           globalState.startupURTwitterLink = response
           ctx.replyWithHTML("twitter link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "tiktok":
           globalState.startupURTikTokLink = response
           ctx.replyWithHTML("tiktok link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "linkedin":
           globalState.startupURLinkedInLink = response
           ctx.replyWithHTML("linkedin link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "other1":
           globalState.startupUROther1Link = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "other2":
           globalState.startupUROtherLink2 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break; 
         case "other3":
           globalState.startupUROtherLink3 = response
           ctx.replyWithHTML("facebook link updatee")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;      
       case "phone":
           globalState.startupURPhoneNumber = response
           ctx.reply("Phone Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;
       case "website":
           globalState.startupURWebsite = response
           ctx.reply("Website Updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;
       case "email":
           globalState.startupUREmail = response
           ctx.reply("updated")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;
       case "sector":
           globalState.startupURHeadQuarterLocation = response
           ctx.scene.state.startupURHeadQuarterLocation
           const res = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
           const { cities } = res.data
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
               ctx.session.startupURHeadQuarterLocation = hqId;
               ctx.scene.state.startupURHeadQuarterLocation = hqId;
               globalState = ctx.scene.state;
           }
           ctx.reply("Updated HeadQuarters")
           ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nFounder2: ${globalState.startupURFounder2}\nFounder3: ${globalState.startupURFounder3}\nFounder4: ${globalState.startupURFounder4}\nFounder5: ${globalState.startupURFounder5}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nEmployee Size: ${globalState.startupUREmployeeSize}\nnWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterLink}\nOther link1: ${globalState.startupUROther1Link}\nOther link2: ${globalState.startupUROther2Link}\nOther link3: ${globalState.startupUROther3Link}`, registerStartupConfirmURKeyboard)
           break;
   }
}
})
//edit startup registeration with UR ends here



// Under here it handover and edit handlers 

export const startupSelectionActionHandler = async (ctx: any) => {
  ctx.deleteMessage()
  const selectedStartup = ctx.match[0];
  console.log(selectedStartup);
  const { data, error } = await getUserByTelegramId({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  if (data) {
    let userId = data.users[0].id;
    console.log(userId);
    ctx.session.sourceStartupUserId = userId;
    console.log(ctx.session.sourceStartpUserId, "hm");
    let checkUserEntity = data.users[0].user_entities;
    if (checkUserEntity) {
      ctx.session.userSName = checkUserEntity.map((nam: any) => (nam.entity["name"]))
      console.log(ctx.session.userSName)
      ctx.session.userSId = checkUserEntity.map((nam: any) => nam.entity["id"])
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
      await ctx.replyWithHTML(`${startupNameBold}\n******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, startupEditHandOverKeyboard)
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
  await ctx.replyWithHTML(`${startupNameBold}\n******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, startupEditKeyboard);
}

export const startupEditFieldHandler = async (ctx: any) => {
  ctx.session.tobeEditedStartupField = ctx.match[0];
  console.log(ctx.session.tobeEditedStartupField);
  ctx.scene.enter("startupEditSpecificFieldScene")
}

export const startupEditSpecificFieldInitHandler = async (ctx: any) => {
  ctx.deleteMessage();
  console.log(ctx.session.tobeEditedStartupField, "hm")
  if (ctx.session.tobeEditedStartupField == "edit_name_of_startup") {
    ctx.replyWithHTML("please enter the new name of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_employee_of_startup") {
    ctx.replyWithHTML("please enter the new employee size of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_email_of_startup") {
    ctx.replyWithHTML("please enter the new email of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_phone_of_startup") {
    ctx.replyWithHTML("please enter the new phone no of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_location_of_startup") {
    ctx.replyWithHTML("please enter the new location of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_websit_of_startup") {
    ctx.replyWithHTML("please enter the new website of your startup", cancelKeyboard);
  }
}
export const startupEditSpecificFieldInputHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.session.tobeEditedStartupField == "edit_name_of_startup") {
      ctx.scene.state.toBeEditedStartupNameField = ctx.message.text;
    } else if (ctx.session.tobeEditedStartupField == "edit_employee_of_startup") {
      ctx.scene.state.tobeEditedStartupEmployeeSizeField = ctx.message.text;
    }
    else if (ctx.session.tobeEditedStartupField == "edit_email_of_startup") {
      ctx.scene.state.tobeEditedStartupEmailField = ctx.message.text;
    }
    else if (ctx.session.tobeEditedStartupField == "edit_phone_of_startup") {
      ctx.scene.state.tobeEditedStartupPhoneField = ctx.message.text;
    }
    else if (ctx.session.tobeEditedStartupField == "edit_location_of_startup") {
      ctx.scene.state.tobeEditedStartupLocationField = ctx.message.text;
    } else if (ctx.session.tobeEditedStartupField == "edit_websit_of_startup") {
      ctx.scene.state.tobeEditedStartupWebsiteField == ctx.message.text;
    }
  }
  ctx.replyWithHTML("you have successfully edited your startup", cancelKeyboard);
})

export const startupEditSpecificFieldSumitHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

})





export const startupHandOverHandler = async (ctx: any) => {
  ctx.scene.enter("handOverStartupScene");
}

export const handOverStartupInitHandler = async (ctx: any) => {
  ctx.deleteMessage();
  ctx.replyWithHTML("Please send us representative phone number", cancelKeyboard)
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
        ctx.replyWithHTML("User registered by this user does not exist on our database please use different number", cancelKeyboard);
        return;
    }else{
      let destId =users[0].id;
      ctx.session.destinationStartupId = destId;
      let BoldRepNo = ctx.message.text.bold();
      ctx.replyWithHTML(`please confirm representative phone \n\n${BoldRepNo}\n\nNote: They will have access to companies once its given`, {
          reply_markup: {
              keyboard: [
                  [{ text: "Yes" }, { text: "No" }],
              ], resize_keyboard: true, one_time_keyboard: true
          }
      })
      return ctx.wizard.next();
      }   
  } else {
    ctx.replyWithHTML("Please enter a valid phone number", cancelKeyboard)
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
                      "entity_id": `${ctx.session.selectedStartupId}`, 
                      "from_user_id": `${ctx.session.sourceStartupUserId}`, 
                      "to_user_id": `${ctx.session.destinationStartupId}`,
                      "created_by": `${ctx.session.sourceStartupUserId}`
                  }
              
          })
          if(errors){
              console.log(errors);
              ctx.replyWithHTML(`Error cease you from handing over your Startup`, cancelKeyboard);
          }else{
            console.log(data)
              ctx.replyWithHTML("You have successfully handed over your Startup", cancelKeyboard);
          }
          // ctx.scene.leave();
    } else if (ctx.message.text == "No") { 
      ctx.replyWithHTML("You haven't handed over your startup", cancelKeyboard)
    }
    // ctx.scene.leave()
  }
}
})
