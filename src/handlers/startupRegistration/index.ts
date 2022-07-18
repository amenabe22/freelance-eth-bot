import FormData from "form-data"
import { Telegraf } from "telegraf";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { cancelKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";
import { registerStartup } from "../../services/startup.process";
import { getUserByPhone, getUserByTelegramId, getUserByTelegramIdStartup, verifyEmailEntity } from "../../services/registration";
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
  startupEditKeyboard,
  socialMediaYesNoKeyboard,
  socialMediaListLGMKeyboard,
  socialMediaListUGMKeyboard,
  socialMediaListLRKeyboard,
  socialMediaListURKeyboard,

} from "../../keybaords/company.registration_kbs"
import { companyHandOver, companyEdit } from "../../services/company.registration";

import { MAX_ST_FOUNDERS_LIMIT } from "../../constants";
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import path from "path";
import fs from "fs";
import { ve, vp, vw, vn } from "../../utils.py/validation";
import request from "request"


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
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
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
      ctx.replyWithHTML(`please enter employee size of your startup.`, cancelKeyboard);
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
    ctx.replyWithHTML(`please enter valid employee size of your startup!`, cancelKeyboard);
    return;
  }
})
export const startupLGMWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMWebsite = " ";
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLGMWebsite = ctx.message.text;
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
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
export const startupLGMSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(`please enter email of your startup.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(`please choose which social media link to enter.`, socialMediaListLGMKeyboard);
    } else {
      ctx.replyWithHTML(`sorry I don't understand!`, socialMediaYesNoKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`sorry I don't understand!`, socialMediaYesNoKeyboard);
    return;
  }
})

export const startupLGMEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupLGMEmail = null;
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.reply("Sorry email is already taken !")
        return;
      }
      ctx.scene.state.startupLGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupLGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, cancelKeyboard);
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, cancelKeyboard);
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
      console.log(globalState, "global states")
      if(!globalState.startupLGMFounder2) {
        globalState.startupLGMFounder2 = " ";
      }else if(!globalState.startupLGMFounder3){
        globalState.startupLGMFounder3 = " ";
      }else if(!globalState.startupLGMFounder4){
        globalState.startupLGMFounder4 = " ";
      }else if(!globalState.startupLGMFounder5){
        globalState.startupLGMFounder5 = " ";      
      }else if (!globalState.startupLGMFacebookLink){
        globalState.startupLGMFacebookLink = " ";
      }else if (!globalState.startupLGMTelegramLink){
        globalState.startupLGMTelegramLink = " ";
      }else if (!globalState.startupYoutubeLink){
        globalState.startupYoutubeLink = " ";
      }else if (!globalState.startupLGMTikTokLink){
        globalState.startupLGMTikTokLink = " ";
      }else if (!globalState.startupLGMTwitterLink){
        globalState.startupLGMTwitterLink = " ";
      }else if (!globalState.startupLGMLinkedInLink){
        globalState.startupLGMLinkedInLink = " ";
      }else if (!globalState.startupLGMOther1Link){
        globalState.startupLGMOther1Link = " ";
      }else if (!globalState.startupLGMOther2Link){
        globalState.startupLGMOther2Link = " ";
      }else if (!globalState.startupLGMOther3Link){
        globalState.startupLGMOther3Link = " ";
      }
 await ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName}\nFounder1: ${globalState.startupLGMFounder1}\nFounder2: ${globalState.startupLGMFounder2}\nFounder3: ${globalState.startupLGMFounder3}\nFounder4: ${globalState.startupLGMFounder4}\nFounder5: ${globalState.startupLGMFounder5}\nPhone: ${globalState.startupLGMPhoneNumber}\nSector: ${globalState.startupLGMSectorName}\nEmployee Size: ${globalState.startupLGMEmployeeSize}\nWebsite: ${globalState.startupLGMWebsite}\nEmail: ${globalState.startupLGMEmail}\nFacebook link: ${globalState.startupLGMFacebookLink}\nTelegram link: ${globalState.startupLGMTelegramLink}\nYouTube link: ${globalState.startupLGMYouTubeLink}\nTikTok link: ${globalState.startupLGMTikTokLink}\nTwitter link: ${globalState.startupLGMTwitterLink}\nLinkedIn link: ${globalState.startupLGMLinkedInLink}\nOther link1: ${globalState.startupLGMOther1Link}\nOther link2: ${globalState.startupLGMOther2Link}\nOther link3: ${globalState.startupLGMOther3Link}`, registerStartupConfirmLGMKeyboard)
 await ctx.replyWithHTML("***********************************", onlyMainMenuKeyboard) 
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
    head_quarter: globalState.startupLGMHeadQuarterLocation,
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
      ctx.reply("sucessfully submitted", cancelKeyboard)
      // ctx.scene.leave();
    } else {
      ctx.reply("failed creating startup")

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard)
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
    if(ctx.session.targetedText == "facebook"){
      ctx.replyWithHTML("please enter facebook link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.replyWithHTML("please enter telegram link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.replyWithHTML("please enter youtube link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.replyWithHTML("please enter tiktok link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.replyWithHTML("please enter twitter link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.replyWithHTML("please enter linkedin link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.replyWithHTML("please enter otherlink1 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.replyWithHTML("please enter otherlink2 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.replyWithHTML("please enter otherlink3 link of your startup", cancelKeyboard);
     }else if(ctx.session.targetedText == "done"){
      ctx.scene.enter("socialMediaLinkDoneLGMScene", ctx.scene.state);
  }
  
  }
  
  export const startupSocialMediaLinkLGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) =>{ 
    if(ctx.session.targetedText == "facebook"){
      ctx.scene.state.startupLGMFacebookLink = ctx.message.text;
      ctx.replyWithHTML(" you have added facebook link.\n\nyou can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.scene.state.startupLGMTelegramLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.scene.state.startupLGMYouTubeLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.scene.state.startupLGMTikTokLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.scene.state.startupLGMTwitterLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.scene.state.startupLGMLinkedInLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.scene.state.startupLGMOther1Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.scene.state.startupLGMOther2Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.scene.state.startupLGMOther3Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLGMKeyboard);
    }else if(ctx.session.targetedText == "done"){
     
      ctx.scene.enter("socialMediaLinkDoneLGMScene", ctx.scene.state);
    }
  })
  export const startupSocialMediaLinkDoneLGMInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter email of your startup.",startupRegisterOptionalKeyboard)
  }
// handling social media in LGM ends here

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
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
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

export const startupRegisteringEditLGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupLGMName = response
        ctx.reply("Name Updated")
        await ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard);        break;
      case "founderN1":
        globalState.startupLGMFounder1 = response
        ctx.replyWithHTML("Founder one Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        return
      case "founderN2":
        globalState.startupLGMFounder2 = response
        ctx.replyWithHTML("Founder two Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        return
      case "founderN3":
        globalState.startupLGMFounder3 = response
        ctx.replyWithHTML("Founder three Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        return
      case "founderN4":
        globalState.startupLGMFounder4 = response
        ctx.replyWithHTML("Founder four Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        return
      case "founderN5":
        globalState.startupLGMFounder5 = response
        ctx.replyWithHTML("Founder five Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        return
      case "employee":
        globalState.startupLGMEmployeeSize = response
        ctx.replyWithHTML("Employee Size updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
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
          ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
          break;
        }
      case "facebook":
        globalState.startupLGMFacebookLink = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "telegram":
        globalState.startupLGMTelegramLink = response
        ctx.replyWithHTML("telegram link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "youtube":
        globalState.startupLGMYouTubeLink = response
        ctx.replyWithHTML("youtube link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "twitter":
        globalState.startupLGMTwitterLink = response
        ctx.replyWithHTML("twitter link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "tiktok":
        globalState.startupLGMTikTokLink = response
        ctx.replyWithHTML("tiktok link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "linkedin":
        globalState.startupLGMLinkedInLink = response
        ctx.replyWithHTML("linkedin link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "other1":
        globalState.startupLGMOther1Link = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "other2":
        globalState.startupLGMOtherLink2 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "other3":
        globalState.startupLGMOtherLink3 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "phone":
        globalState.startupLGMPhoneNumber = response
        ctx.reply("Phone Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "website":
        globalState.startupLGMWebsite = response
        ctx.reply("Website Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        break;
      case "email":
        globalState.startupLGMEmail = response
        ctx.reply("updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
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
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLGMName} \nFounder1: ${globalState.startupLGMFounder1} \nFounder2: ${globalState.startupLGMFounder2} \nFounder3: ${globalState.startupLGMFounder3} \nFounder4: ${globalState.startupLGMFounder4} \nFounder5: ${globalState.startupLGMFounder5} \nPhone: ${globalState.startupLGMPhoneNumber} \nSector: ${globalState.startupLGMSectorName} \nEmployee Size: ${globalState.startupLGMEmployeeSize} \nWebsite: ${globalState.startupLGMWebsite} \nEmail: ${globalState.startupLGMEmail} \nFacebook link: ${globalState.startupLGMFacebookLink} \nTelegram link: ${globalState.startupLGMTelegramLink} \nYouTube link: ${globalState.startupLGMYouTubeLink} \nTikTok link: ${globalState.startupLGMTikTokLink} \nTwitter link: ${globalState.startupLGMTwitterLink} \nOther link1: ${globalState.startupLGMOther1Link} \nOther link2: ${globalState.startupLGMOther2Link} \nOther link3: ${globalState.startupLGMOther3Link} `, registerStartupConfirmLGMKeyboard)
        await ctx.replyWithHTML("**********************************", onlyMainMenuKeyboard)
        break;
    }
  }
})

//edit startup registeration with LGM ends here


//Unlicensed startup registration  starts here.
export const startupUInitHandler = async (ctx: any) => {
  ctx.replyWithHTML('please enter the name of your startup', cancelKeyboard);
}
export const startupUNameHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMName = ctx.message.text;
    ctx.replyWithHTML(`please enter startup founder name`, cancelKeyboard);
    return ctx.wizard.next();
  } else {
    ctx.replyWithHTML(`Please enter a founder name!`, cancelKeyboard);
    return;
  }
})
export const startupUFoundersHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    ctx.scene.state.startupUGMFounder2 = " "
    ctx.scene.state.startupUGMFounder3 = " "
    ctx.scene.state.startupUGMFounder4 = " "
    ctx.scene.state.startupUGMFounder5 = " "
    if (ctx.message.text == "Done") {
      ctx.replyWithHTML(`please send one of founder id photo. `, cancelKeyboard);
      return ctx.wizard.next();
    } else if (vn(ctx.message.text)) {
      totalAddedFounders++
      ctx.scene.state[`startupUGMFounder${totalAddedFounders}`] = ctx.message.text;
      console.log(ctx.scene.state[`startupUGMFounder${totalAddedFounders} `])
      if (totalAddedFounders >= MAX_ST_FOUNDERS_LIMIT) {
        ctx.replyWithHTML(`please send one of founder id photo. `, cancelKeyboard);
        return ctx.wizard.next();
      }
      ctx.replyWithHTML(`please enter startup founder name`, starupFounderKeyboard);
    } else {
      ctx.replyWithHTML(`please enter a valid startup fundar name!`, starupFounderKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`please enter a valid startup fundar name!`, starupFounderKeyboard);
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
      const { data, error } = await fetchSectors()
      if (data) {
        const { sectors } = data;
        let snames = sectors.map((nm: any) => nm.name);
        ctx.session.sectorNames = snames
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
          }),
        })
      }
      return ctx.wizard.next();
    })
  } else {
    ctx.replyWithHTML(`Please enter avalid founder id photo!`, cancelKeyboard);
    return;
  }
})
export const startupUIndustrySectorHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
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
      ctx.replyWithHTML(`please enter startup website.`, startupRegisterOptionalKeyboard);
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

export const startupUWebsiteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMWebsite = " ";
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupUGMWebsite = ctx.message.text;
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
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
export const startupUSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(`please enter email of your startup.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(`please choose which social media link to enter.`, socialMediaListUGMKeyboard);
    } else {
      ctx.replyWithHTML(`sorry I don't understand!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`sorry I don't understand!`, startupRegisterOptionalKeyboard);
    return;
  }
})

export const startupUEmailHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "Skip") {
      ctx.scene.state.startupUGMEmail = " ";
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else if (ve(ctx.message.text)) {
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.reply("Sorry email is already taken !")
        return;
      }
      ctx.scene.state.startupUGMEmail = ctx.message.text;
      console.log(ctx.scene.state.startupUGMEmail);
      ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
      return ctx.wizard.next();
    } else {
      ctx.replyWithHTML(`please enter valid email address of your startup!`, cancelKeyboard);
    }
  } else {
    ctx.replyWithHTML(`please enter valid email address of your startup!`, cancelKeyboard);
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
export const startupUHeadQuarterLocationHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
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
      await ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName}\nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
      await ctx.replyWithHTML("****************************", onlyMainMenuKeyboard)
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
    head_quarter: globalState.startupUGMHeadQuarterLocation,
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
      ctx.reply("sucessfully submitted", cancelKeyboard)
      // ctx.scene.leave();
    } else {

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard)
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
    if(ctx.session.targetedText == "facebook"){
      ctx.replyWithHTML("please enter facebook link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.replyWithHTML("please enter telegram link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.replyWithHTML("please enter youtube link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.replyWithHTML("please enter tiktok link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.replyWithHTML("please enter twitter link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.replyWithHTML("please enter linkedin link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.replyWithHTML("please enter otherlink1 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.replyWithHTML("please enter otherlink2 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.replyWithHTML("please enter otherlink3 link of your startup", cancelKeyboard);
     }else if(ctx.session.targetedText == "done"){
      ctx.scene.enter("socialMediaLinkDoneUScene", ctx.scene.state);
  }
  
  }
  
  export const startupSocialMediaLinkUValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) =>{ 
    if(ctx.session.targetedText == "facebook"){
      ctx.scene.state.startupUGMFacebookLink = ctx.message.text;
      ctx.replyWithHTML(" you have added facebook link.\n\nyou can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.scene.state.startupUGMTelegramLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.scene.state.startupUGMYouTubeLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.scene.state.startupUGMTikTokLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.scene.state.startupUGMTwitterLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.scene.state.startupUGMLinkedInLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.scene.state.startupUGMOther1Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.scene.state.startupUGMOther2Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.scene.state.startupUGMOther3Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListUGMKeyboard);
    }else if(ctx.session.targetedText == "done"){
      ctx.scene.enter("socialMediaLinkDoneUScene", ctx.scene.state);
    }
  })
  export const startupSocialMediaLinkDoneUInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter email of your startup.",startupRegisterOptionalKeyboard)
  }
//handling social media for UGM ends here...

//edit startup registeration with UGM starts here

export const editRegisterStartupUHandler = async (ctx: any) => {
  ctx.replyWithHTML("please choose which field to edit", registerStartupToBeEditFieldUGMKeyboard);
}
export const editRegisterStartupUCbActionHandler = async (ctx: any) => {
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
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
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

export const startupRegisteringEditUValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupUGMName = response
        ctx.reply("Name Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "founderN1":
        globalState.startupUGMFounder1 = response
        ctx.replyWithHTML("Founder one Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        return
      case "founderN2":
        globalState.startupUGMFounder2 = response
        ctx.replyWithHTML("Founder two Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        return
      case "founderN3":
        globalState.startupUGMFounder3 = response
        ctx.replyWithHTML("Founder three Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        return
      case "founderN4":
        globalState.startupUGMFounder4 = response
        ctx.replyWithHTML("Founder four Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        return
      case "founderN5":
        globalState.startupUGMFounder5 = response
        ctx.replyWithHTML("Founder five Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        return
      case "employee":
        globalState.startupUGMEmployeeSize = response
        ctx.replyWithHTML("Employee Size updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
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
          ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
          break;
        }
      case "facebook":
        globalState.startupUGMFacebookLink = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "telegram":
        globalState.startupUGMTelegramLink = response
        ctx.replyWithHTML("telegram link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "youtube":
        globalState.startupUGMYouTubeLink = response
        ctx.replyWithHTML("youtube link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "twitter":
        globalState.startupUGMTwitterLink = response
        ctx.replyWithHTML("twitter link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "tiktok":
        globalState.startupUGMTikTokLink = response
        ctx.replyWithHTML("tiktok link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "linkedin":
        globalState.startupUGMLinkedInLink = response
        ctx.replyWithHTML("linkedin link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "other1":
        globalState.startupUGMOther1Link = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "other2":
        globalState.startupUGMOtherLink2 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "other3":
        globalState.startupUGMOtherLink3 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "phone":
        globalState.startupUGMPhoneNumber = response
        ctx.reply("Phone Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "website":
        globalState.startupUGMWebsite = response
        ctx.reply("Website Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        break;
      case "email":
        globalState.startupUGMEmail = response
        ctx.reply("updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
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
        await ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupUGMName} \nFounder1: ${globalState.startupUGMFounder1} \nFounder2: ${globalState.startupUGMFounder2} \nFounder3: ${globalState.startupUGMFounder3} \nFounder4: ${globalState.startupUGMFounder4} \nFounder5: ${globalState.startupUGMFounder5} \nPhone: ${globalState.startupUGMPhoneNumber} \nSector: ${globalState.startupUGMSectorName} \nWebsite: ${globalState.startupUGMWebsite} \nEmail: ${globalState.startupUGMEmail} \nFacebook link: ${globalState.startupUGMFacebookLink} \nTelegram link: ${globalState.startupUGMTelegramLink} \nYouTube link: ${globalState.startupUGMYouTubeLink} \nTikTok link: ${globalState.startupUGMTikTokLink} \nTwitter link: ${globalState.startupUGMTwitterLink} \nOther link1: ${globalState.startupUGMOther1Link} \nOther link2: ${globalState.startupUGMOther2Link} \nOther link3: ${globalState.startupUGMOther3Link} `, registerStartupConfirmUGMKeyboard)
        await ctx.replyWithHTML("***********************", onlyMainMenuKeyboard);
        break;

    }
  }
})
//edit startup registeration with U ends here


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
    ctx.replyWithHTML(`Please enter startup name!`, cancelKeyboard);
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
      ctx.replyWithHTML(`please enter G / M id photo.`, cancelKeyboard);
      return ctx.wizard.next();
    })
  } else if (ctx.message.text && ctx.message.text == "Skip") {
    ctx.replyWithHTML(`please enter G / M id photo.`, cancelKeyboard);
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
    ctx.replyWithHTML(`Please enter avalid G / M id photo!`, cancelKeyboard);
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
        let secs = ctx.session.sectorNames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
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
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
      return ctx.wizard.next();
    } else if (vw(ctx.message.text)) {
      ctx.scene.state.startupLRWebsite = ctx.message.text;
      ctx.replyWithHTML(`Do you want to add social media links.`, socialMediaYesNoKeyboard);
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
export const startupLRSocialMediaLinkHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
  if (ctx.message.text) {
    if (ctx.message.text == "No") {
      ctx.replyWithHTML(`please enter email of your startup.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    } else if (ctx.message.text == "Yes") {
      ctx.replyWithHTML(`please choose which social media link to enter.`, socialMediaListLRKeyboard);
    } else {
      ctx.replyWithHTML(`sorry I don't understand!`, startupRegisterOptionalKeyboard);
      return;
    }
  } else {
    ctx.replyWithHTML(`sorry I don't understand!`, startupRegisterOptionalKeyboard);
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
      const rs = await verifyEmailEntity({ email: ctx.message.text })
      if (rs.data.entities.length) {
        ctx.reply("Sorry email is already taken !")
        return;
      }
      ctx.scene.state.startupLREmail = ctx.message.text;
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
      ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
      // Finish line
      ctx.reply("Finished here is your info please approve")

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
    head_quarter: globalState.startupLRHeadQuarterLocation,
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
      ctx.reply("sucessfully submitted", cancelKeyboard)
      // ctx.scene.leave();
    } else {

    }
    console.log(globalState, "cr")
  }).catch((e) => {
    const message = e.response.data
    console.error(JSON.stringify(message))
    console.log(message.graphQLErrors, "errroooooor")
    ctx.reply("failed to register startup", cancelKeyboard)
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
    if(ctx.session.targetedText == "facebook"){
      ctx.replyWithHTML("please enter facebook link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.replyWithHTML("please enter telegram link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.replyWithHTML("please enter youtube link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.replyWithHTML("please enter tiktok link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.replyWithHTML("please enter twitter link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.replyWithHTML("please enter linkedin link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.replyWithHTML("please enter otherlink1 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.replyWithHTML("please enter otherlink2 link of your startup", cancelKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.replyWithHTML("please enter otherlink3 link of your startup", cancelKeyboard);
     }else if(ctx.session.targetedText == "done"){
      ctx.scene.enter("socialMediaLinkDoneLRScene", ctx.scene.state);
  }
  
  }
  
  export const startupSocialMediaLinkLRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) =>{ 
    if(ctx.session.targetedText == "facebook"){
      ctx.scene.state.startupLRFacebookLink = ctx.message.text;
      ctx.replyWithHTML(" you have added facebook link.\n\nyou can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "telegram"){
      ctx.scene.state.startupLRTelegramLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "youtube"){
      ctx.scene.state.startupLRYouTubeLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "tiktok"){
      ctx.scene.state.startupLRTikTokLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "twitter"){
      ctx.scene.state.startupLRTwitterLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "linkedin"){
      ctx.scene.state.startupLRLinkedInLink = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "otherlink1"){
      ctx.scene.state.startupLROther1Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "otherlink2"){
      ctx.scene.state.startupLROther2Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "otherlink3"){
      ctx.scene.state.startupLROther3Link = ctx.message.text;
      ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListLRKeyboard);
    }else if(ctx.session.targetedText == "done"){
      ctx.scene.enter("socialMediaLinkDoneLRScene", ctx.scene.state);
    }
  })
  export const startupSocialMediaLinkDoneLRInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter email of your startup.",startupRegisterOptionalKeyboard)
  }
  
// hanling social media links for LR ends here


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
        let secs = snames.map((x: string, _: string) => ([{
          text: x,
        }]))
        secs.push([{ text: "Back" }])
        ctx.replyWithHTML("please enter industry sector.", {
          reply_markup: JSON.stringify({
            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
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

export const startupRegisteringEditLRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

  const response = ctx.message.text
  const target = ctx.session.editTarget
  console.log(response, target, "dawg")
  if (response) {
    // validate and update state
    switch (target) {
      case "name":
        globalState.startupLRName = response
        ctx.reply("Name Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "founderN1":
        globalState.startupLRFounder1 = response
        ctx.replyWithHTML("Founder one Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        return
      case "founderN2":
        globalState.startupLRFounder2 = response
        ctx.replyWithHTML("Founder two Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        return
      case "founderN3":
        globalState.startupLRFounder3 = response
        ctx.replyWithHTML("Founder three Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        return
      case "founderN4":
        globalState.startupLRFounder4 = response
        ctx.replyWithHTML("Founder four Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        return
      case "founderN5":
        globalState.startupLRFounder5 = response
        ctx.replyWithHTML("Founder five Name Updated");
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        return
      case "employee":
        globalState.startupLREmployeeSize = response
        ctx.replyWithHTML("Employee Size updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
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
          ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
          break;
        }
      case "facebook":
        globalState.startupLRFacebookLink = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "telegram":
        globalState.startupLRTelegramLink = response
        ctx.replyWithHTML("telegram link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "youtube":
        globalState.startupLRYouTubeLink = response
        ctx.replyWithHTML("youtube link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "twitter":
        globalState.startupLRTwitterLink = response
        ctx.replyWithHTML("twitter link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "tiktok":
        globalState.startupLRTikTokLink = response
        ctx.replyWithHTML("tiktok link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "linkedin":
        globalState.startupLRLinkedInLink = response
        ctx.replyWithHTML("linkedin link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "other1":
        globalState.startupLROther1Link = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "other2":
        globalState.startupLROtherLink2 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "other3":
        globalState.startupLROtherLink3 = response
        ctx.replyWithHTML("facebook link updatee")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "phone":
        globalState.startupLRPhoneNumber = response
        ctx.reply("Phone Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "website":
        globalState.startupLRWebsite = response
        ctx.reply("Website Updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
        break;
      case "email":
        globalState.startupLREmail = response
        ctx.reply("updated")
        ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
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
       await ctx.replyWithHTML(`Here is your data\nStartupName:${globalState.startupLRName} \nFounder1: ${globalState.startupLRFounder1} \nFounder2: ${globalState.startupLRFounder2} \nFounder3: ${globalState.startupLRFounder3} \nFounder4: ${globalState.startupLRFounder4} \nFounder5: ${globalState.startupLRFounder5} \nPhone: ${globalState.startupLRPhoneNumber} \nSector: ${globalState.startupLRSectorName} \nEmployee Size: ${globalState.startupLREmployeeSize} \nWebsite: ${globalState.startupLRWebsite} \nEmail: ${globalState.startupLREmail} \nFacebook link: ${globalState.startupLRFacebookLink} \nTelegram link: ${globalState.startupLRTelegramLink} \nYouTube link: ${globalState.startupLRYouTubeLink} \nTikTok link: ${globalState.startupLRTikTokLink} \nTwitter link: ${globalState.startupLRTwitterLink} \nOther link1: ${globalState.startupLROther1Link} \nOther link2: ${globalState.startupLROther2Link} \nOther link3: ${globalState.startupLROther3Link} `, registerStartupConfirmLRKeyboard)
       await ctx.replyWithHTML("***********************", onlyMainMenuKeyboard);
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
      let myStartups = checkUserEntity.filter((startup: any)=>{
        if(startup.entity["verified_at"] != null){
          return true;
        }
      });
      console.log("my startups list",myStartups)
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
    ctx.replyWithHTML("please enter the new name of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_employee_of_startup") {
    ctx.replyWithHTML("please enter the new employee size of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_email_of_startup") {
    ctx.replyWithHTML("please enter the new email of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_phone_of_startup") {
    ctx.replyWithHTML("please enter the new phone no of your startup", cancelKeyboard);
  } else if (ctx.session.tobeEditedStartupField == "edit_location_of_startup") {
    ctx.replyWithHTML("please enter the new location of your company", {
      reply_markup: JSON.stringify({
        keyboard: ctx.session.cityNames.map((x: string, _: string) => ([{
          text: x,
        }])), resize_keyboard: true, one_time_keyboard: true,
      }),
    });
  } else if (ctx.session.tobeEditedStartupField == "edit_websit_of_startup") {
    ctx.replyWithHTML("please enter the new website of your startup", cancelKeyboard);
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
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
          ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
        ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard);
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
            "entity_id": `${ctx.session.selectedStartupId} `,
            "from_user_id": `${ctx.session.sourceStartupUserId} `,
            "to_user_id": `${ctx.session.destinationStartupId} `,
            "created_by": `${ctx.session.sourceStartupUserId} `
          }

        })
        if (errors) {
          console.log(errors);
          ctx.replyWithHTML(`Error cease you from handing over your Startup`, cancelKeyboard);
        } else {
          console.log(data)
          ctx.replyWithHTML("You have successfully handed over your Startup", cancelKeyboard);
        }
        // ;
      } else if (ctx.message.text == "No") {
        ctx.replyWithHTML("You haven't handed over your startup", cancelKeyboard)
      }
      // 
    }
  }
})
