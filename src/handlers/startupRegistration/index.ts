import FormData from "form-data"
import { Telegraf } from "telegraf";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { registerStartup } from "../../services/startup.process";
import { getUserByTelegramId } from "../../services/registration";
import {
  registerStartupConfirmLGMKeyboard,
  registerStartupConfirmUGMKeyboard,
  registerStartupConfirmLRKeyboard,
  registerStartupConfirmURKeyboard,
  startupRegisterOptionalKeyboard,
  starupFounderKeyboard,
  // startupCompanyEditKeyboard,
  startupEditHandOverKeyboard,
  startupEditKeyboard
} from "../../keybaords/company.registration_kbs"
import { MAX_ST_FOUNDERS_LIMIT } from "../../constants";
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import path from "path";
import fs from "fs";
import { ve, vp, vw } from "../../utils.py/validation";
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
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      totalAddedFounders++
      ctx.scene.state[`startupLGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupLGMFounder${totalAddedFounders}`])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(`please enter startup founder name`, starupFounderKeyboard);
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
    } else {
      ctx.scene.state.startupLGMEmployeeSize = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMEmployeeSize);
    ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMWebsite = " ";
    } else {
      ctx.scene.state.startupLGMWebsite = ctx.message.text;
    }
    ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMFacebookLink = " ";
    } else {
      ctx.scene.state.startupLGMFacebookLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMFacebookLink);
    ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTelegramLink = " ";
    } else {
      ctx.scene.state.startupLGMTelegramLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMTelegramLink);
    ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMYouTubeLink = " ";
    } else {
      ctx.scene.state.startupLGMYouTubeLink = ctx.message.text;
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
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTikTokLink = " ";
    } else {
      ctx.scene.state.startupLGMTikTokLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMTikTokLink);
    ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMTwitterLink = " ";
    } else {
      ctx.scene.state.startupLGMTwitterLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMTwitterLink);
    ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther1Link = " ";
    } else {
      ctx.scene.state.startupLGMOther1Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMOther1Link);
    ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther2Link = " ";
    } else {
      ctx.scene.state.startupLGMOther2Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMOther2Link);
    ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter ohter link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMOtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMOther3Link = " ";
    } else {
      ctx.scene.state.startupLGMOther3Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMOther3Link);
    ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ve(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMEmail = " ";
    } else {
      ctx.scene.state.startupLGMEmail = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLGMEmail);
    ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
  }
})
export const startupOfficialPhoneNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
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
export const startupHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
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
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterL}\nOther link: ${globalState.startupLGMOther1Link}`, registerStartupConfirmLGMKeyboard)
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
    // rep_letter_photo: fs.createReadStream(path.join(`files/letterPhoto/${ctx.from.id}.jpg`)),
    rep_letter_photo: null,
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


export const editRegisterStartupInitLGMHandler = async (ctx: any) => {

}

export const editRegisterStartUpLGMHandler = async (ctx: any) => {

}

//licensed startup registration with General manager ends here...


//Unlicensed startup registration by General Manager handler  starts here.
export const startupUGMInitHandler = (ctx: any) => {
  ctx.replyWithHTML("please enter the name of your startup", cancelKeyboard);
}
export const startupUGMNameHandler = Telegraf.on("text", (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMName = ctx.message.text;
    console.log(ctx.scene.state.startupUGMName)
    ctx.replyWithHTML(`please enter startup founder name.`, cancelKeyboard);
    return ctx.wizard.next();
  }
})
export const startupUGMFirstFounderNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please enter trade license photo of your startup`, startupRegisterOptionalKeyboard);
    } else {
      totalAddedFounders++
      ctx.scene.state[`startupUGMFounder${totalAddedFounders}Name`] = ctx.message.text;
      console.log(ctx.scene.state[`startupUGMFounder${totalAddedFounders}Name`])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please enter trade license photo of your startup`, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
      }
    }
    ctx.replyWithHTML("please enter another founder name", starupFounderKeyboard);
  }
})
export const startupUGMTradeLicenseHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
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
export const startupUGMIdPhotoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.update.message.photo) {
    console.log(ctx.update.message.photo[2].file_id);
    const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.photo[2].file_id)
    console.log(downloadURL);
    const fname = `${ctx.from.id}.jpg`
    download(downloadURL, `files/GMIdphoto/${fname}`,).then(async () => {
      ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    })
  } else if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(` please enter valid id photo!`, cancelKeyboard);
    return
  }
})
export const startupUGMEmployeeSizeHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmployeeSize == " ";
    } else {
      ctx.scene.state.startupUGMEmployeeSize = ctx.message.text;
    }
    ctx.replyWithHTML(`please enter website of your startup`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter avalid employee size`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMWebsite = " ";
    } else {
      ctx.scene.state.startupUGMWebsite = ctx.message.text;
    }
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
  } else {
    ctx.replyWithHTML(`sorry I dont understand`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUGMSectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMSectorName = ctx.message.text;
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
      ctx.session.startupUGMSectorID = sectorId;
      ctx.scene.state.startupUGMSectorID = sectorId;
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
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
export const startupUGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ve(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmail = " ";
    } else {
      ctx.scene.state.startupUGMEmail = ctx.message.text;
    }
    ctx.replyWithHTML("please enter phone number of your startup", cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML("please enter valid email", startupRegisterOptionalKeyboard)
  }
})
export const startupUGMPhoneNumberHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vp(ctx.message.text)) {
    ctx.scene.state.startupUGMPhoneNumber = ctx.message.text;
    const { data, error } = await fetchCities()
    if (data) {
      const { cities } = data;
      let cnames = cities.map((nm: any) => nm.name);
      ctx.session.cityNames = cnames
      ctx.replyWithHTML("please enter location of your startup head quarter.", {
        reply_markup: JSON.stringify({
          keyboard: ctx.session.cityNames.map((x: string, _: string) => ([{
            text: x,
          }])), resize_keyboard: true, one_time_keyboard: true,
        }),
      })
    }
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter a valid Phone No!`, cancelKeyboard);
    return ctx.wizard.next();
  }
})
export const startupUGMHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMHeadQuarterLocation = ctx.message.text;
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
      console.log("bpt 2", hqId)
      ctx.session.startupLGMHeadQuarterLocation = hqId;
      ctx.scene.state.startupLGMHeadQuarterLocation = hqId;
      globalState = ctx.scene.state;
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName}\nFounder1: ${globalState.startupUGMFounder1}\nPhone: ${globalState.startupUGMPhoneNumber}\nSector: ${globalState.startupUGMSectorName}\nWebsite: ${globalState.startupUGMWebsite}\nEmail: ${globalState.startupUGMEmail}`, registerStartupConfirmUGMKeyboard);
    }
  } else {
    ctx.replyWithHTML(`please enter a valid location of your startup.`, {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, _: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    });
  }
})

export const confirmRegisterStartUpUGMHandler = async (ctx: any) => {
  const formData = new FormData()
  const payload: any = {
    'name': globalState.startupUGMName,
    'founder': globalState.startupUGMFounderName,
    'phone': globalState.startupUGMPhoneNumber,
    'sector': globalState.startupUGMSectorID,
    'is_user_gm': globalState.statupUGMIsUserGm,
    'user_first_name': globalState.startupUGMUFN,
    'user_last_name': globalState.startupUGMULN,
    'employee_size': globalState.startupUGMEmployeeSize,
    'website': globalState.startupUGMWebsite,
    'email': globalState.startupUGMEmail,
    'user_phone': globalState.startupUGMUP,
    'head_quarter': globalState.startupUGMHeadQuarterLocation,
    'facebook_link': globalState.startupUGMFacebookLink,
    'telegram_link': globalState.startupUGMFacebookLink,
    'youtube_link': globalState.startupUGMFacebookLink,
    'tiktok_link': globalState.startupUGMFacebookLink,
    'twitter_link': globalState.startupUGMFacebookLink,
    'linkedin': globalState.startupUGMFacebookLink,
    'other_link_one': globalState.startupUGMFacebookLink,
    'other_link_two': globalState.startupUGMFacebookLink,
    'other_link_three': globalState.startupUGMFacebookLink,
    'trade_license_photo': path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`),
    'rep_id_photo': path.join(`files/GMIdphoto/${ctx.from.id}.jpg`),
    'rep_letter_photo': path.join(`files/letterPhoto/${ctx.from.id}.jpg`),
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



export const editRegisterStartUpUGMHandler = async (ctx: any) => {

}

//Unicensed startup registration with General manager endes here...


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
    totalAddedFounders++
    ctx.scene.state[`startupLRFounder${totalAddedFounders}`] = ctx.message.text;
    console.log(ctx.scene.state[`startupLRFounder${totalAddedFounders}`]);
    if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
    }
    ctx.replyWithHTML(`please enter startup founder name 2. `, startupRegisterOptionalKeyboard);
  } else {
    ctx.replyWithHTML(`please enter a valid startup fundar name`, startupRegisterOptionalKeyboard);
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
    } else {
      ctx.scene.state.startupLREmployeeSize = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLREmployeeSize);
    ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRWebsite = " ";
    } else {
      ctx.scene.state.startupLRWebsite = ctx.message.text;
    }
    ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRFacebookLink = " ";
    } else {
      ctx.scene.state.startupLRFacebookLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLRFacebookLink);
    ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid Facebook link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTelegramLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTelegramLink = " ";
    } else {
      ctx.scene.state.startupLRTelegramLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLRTelegramLink);
    ctx.replyWithHTML(`please enter YouTube link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid Telegram link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRYouTubeLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRYouTubeLink = " ";
    } else {
      ctx.scene.state.startupLRYouTubeLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLRYouTubeLink);
    ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTikTokLink = " ";
    } else {
      ctx.scene.state.startupLRTikTokLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLRTikTokLink);
    ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLRTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLRTwitterLink = " ";
    } else {
      ctx.scene.state.startupLRTwitterLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLRTwitterLink);
    ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther1Link = " ";
    } else {
      ctx.scene.state.startupLROther1Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLROther1Link);
    ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther2Link = " ";
    } else {
      ctx.scene.state.startupLROther2Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLROther2Link);
    ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter ohter link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLROtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLROther3Link = " ";
    } else {
      ctx.scene.state.startupLROther3Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLROther3Link);
    ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupLREmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ve(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLREmail = " ";
    } else {
      ctx.scene.state.startupLREmail = ctx.message.text;
    }
    console.log(ctx.scene.state.startupLREmail);
    ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
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
      console.log("bpt 2", hqId)
      ctx.session.startupLRHeadQuarterLocation = hqId;
      ctx.scene.state.startupLRHeadQuarterLocation = hqId;
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
    'trade_license_photo': path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`),
    'rep_id_photo': path.join(`files/GMIdphoto/${ctx.from.id}.jpg`),
    'rep_letter_photo': path.join(`files/letterPhoto/${ctx.from.id}.jpg`),
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


export const editRegisterStartUpLRHandler = async (ctx: any) => {

}
//licensed startup registration with representative ends here...

//unlicensed startup registration with Representative starts 

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
    totalAddedFounders++
    ctx.scene.state[`startupURFounder${totalAddedFounders}Name`] = ctx.message.text;
    if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
      ctx.replyWithHTML("please enter startup trade license photo", startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }
    // increment total founders added
    ctx.replyWithHTML("please enter another founder name", starupFounderKeyboard);
    return;
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
    } else {
      ctx.scene.state.startupUREmployeeSize = ctx.message.text;
    }
    console.log(ctx.scene.state.startupUREmployeeSize);
    ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURWebsite = " ";
    } else {
      ctx.scene.state.startupURWebsite = ctx.message.text;
    }
    ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURFacebookLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURFacebookLink = " ";
    } else {
      ctx.scene.state.startupURFacebookLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupURFacebookLink);
    ctx.replyWithHTML(`please enter Telegram link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
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
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURYouTubeLink = " ";
    } else {
      ctx.scene.state.startupURYouTubeLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupURYouTubeLink);
    ctx.replyWithHTML(`please enter Tiktok link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid YouTube link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURTikTokLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURTikTokLink = " ";
    } else {
      ctx.scene.state.startupURTikTokLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupURTikTokLink);
    ctx.replyWithHTML(`please enter Twitter link of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupURTwitterLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupURTwitterLink = " ";
    } else {
      ctx.scene.state.startupURTwitterLink = ctx.message.text;
    }
    console.log(ctx.scene.state.startupURTwitterLink);
    ctx.replyWithHTML(`please enter other Link 1 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid TikTok link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther1Link = " ";
    } else {
      ctx.scene.state.startupUROther1Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupUROther1Link);
    ctx.replyWithHTML(`please enter other link 2 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid link of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther2Link = " ";
    } else {
      ctx.scene.state.startupUROther2Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupUROther2Link);
    ctx.replyWithHTML(`please enter other link 3 of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter ohter link 2 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUROtherLink3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (vw(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUROther3Link = " ";
    } else {
      ctx.scene.state.startupUROther3Link = ctx.message.text;
    }
    console.log(ctx.scene.state.startupUROther3Link);
    ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid other link 3 of your startup!`, startupRegisterOptionalKeyboard);
    return;
  }
})
export const startupUREmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ve(ctx.message.text)) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUREmail = " ";
    } else {
      ctx.scene.state.startupUREmail = ctx.message.text;
    }
    console.log(ctx.scene.state.startupUREmail);
    ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
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

      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupURName}\nFounder1: ${globalState.startupURFounder1}\nPhone: ${globalState.startupURPhoneNumber}\nSector: ${globalState.startupURSectorName}\nWebsite: ${globalState.startupURWebsite}\nEmail: ${globalState.startupUREmail}\nFacebook link: ${globalState.startupURFacebookLink}\nTelegram link: ${globalState.startupURTelegramLink}\nYouTube link: ${globalState.startupURYouTubeLink}\nTikTok link: ${globalState.startupURTikTokLink}\nTwitter link: ${globalState.startupURTwitterL}\nOther link: ${globalState.startupUROther1Link}`, registerStartupConfirmURKeyboard)

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
    'trade_license_photo': path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`),
    'rep_id_photo': path.join(`files/GMIdphoto/${ctx.from.id}.jpg`),
    'rep_letter_photo': path.join(`files/letterPhoto/${ctx.from.id}.jpg`),
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












export const startupSelectionActionHandler = async (ctx: any) => {
  ctx.deleteMessage()
  const selectedStartup = ctx.match[0];
  console.log(selectedStartup);
  const { data, error } = await getUserByTelegramId({
    telegram_id: JSON.stringify(ctx.from.id)
  })
  if (data) {
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
    let BoldRepNo = ctx.message.text.bold();
    ctx.replyWithHTML(`please confirm representative phone \n\n${BoldRepNo}\n\nNote: They will have access to companies once its given`, {
      reply_markup: {
        keyboard: [
          [{ text: "Yes" }, { text: "No" }],
        ], resize_keyboard: true, one_time_keyboard: true
      }
    })
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML("Please enter a valid phone number", cancelKeyboard)
  }
})
export const handOverStartupYesNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Yes") {
      ctx.replyWithHTML("You have successfully handed over your startup", cancelKeyboard);
    } else if (ctx.message.text == "No") {
      ctx.replyWithHTML("You haven't handed over your startup", cancelKeyboard)
    }
  }
})
