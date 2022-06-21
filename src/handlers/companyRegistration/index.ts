import { bot } from "../../setup";
import { Telegraf, Context } from "telegraf";
import request from "request";
import fs from "fs";
import FormData from "form-data";
import path from "path";
// import  fetch from 'node-fetch';
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { getUserByTelegramId } from "../../services/registration";
import {
    companyRegisterOptionalKeyboard,
    registerCompanyConfirmKeyboard,
    registerCompanyConfirmGMKeyboard
} from "../../keybaords/company.registration_kbs";
import { registerCompany } from "../../services/company.registration";
let globalState: any;

const download = (url: any, path: any, callback: any) => {
    request.head(url, () => {
        request(url).pipe(fs.createWriteStream(path)).on('close', callback);
    });
};


export const confirmRegisterCompanyGMActionHanlder = async (ctx: any) => {
    ctx.answerCbQuery();
    const
        {
            companyGName,
            companyGNameBold,
            companyGSectorName,
            companyGSectorID,
            companyGEmployeeSize,
            companyRWebsite,
            companyGEmail,
            companyGPhoneNumber,
            companyGHeadQuarterLocation,
            companyGHeadQuarterLocationId
        } = globalState
    const formData = new FormData()
    const payload: any = {
        name: companyGName,
        phone: companyGPhoneNumber,
        type: null,
        sector_id: companyGSectorID,
        origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
        user_first_name: "",
        user_last_name: "",
        employee_size: companyGEmployeeSize,
        user_phone: null,
        website: companyRWebsite,
        email: companyGEmail,
        is_user_gm: false,
        head_quarter: companyGHeadQuarterLocationId,
        trade_license_photo: null,
        rep_id_photo: null,
        rep_letter_photo: null,
        folder: "entity",
    }

    for (const key of Object.keys(payload)) {
        if (payload[key])
            formData.append(key, payload[key])
    }

    const { data } = await registerCompany(formData)
    if (data) {
        ctx.deleteMessage();
        ctx.reply("submitted")
    } else {
        ctx.reply("failed to register company")
    }
    console.log(globalState, "cr")
}
export const confirmRegisterCompanyActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    console.log(globalState, "crr")

    ctx.reply("submitted")
}
//register company with representative starts here
export const companyNameRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRName = ctx.message.text;
        console.log(ctx.scene.state.companyRName);
        ctx.scene.state.companyRNameBold = ctx.scene.state.companyRName.bold();
        ctx.replyWithHTML(`please send the photo of company trade license scanned photo.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid name!`, cancelKeyboard);
        return;
    }
})
export const companyTradeLicensePhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        console.log(ctx.update.message.photo[0])
        const companyTradeLicensePhoto = ctx.update.message.photo[0].file_id;
        // const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${companyTradeLicensePhoto}`);
        //    console.log(res);
        //    const res2 = await res.json();
        //    const filePath = res2.result.file_path;
        //    const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
        //    console.log(downloadURL);
        //    download(downloadURL, path.join(('companyTradeLicencePhotos'), `${ctx.from.id}.jpg`), () =>
        //    console.log('Done!')
        //    )
        ctx.replyWithHTML(`please enter Representative id photo.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
})
export const companyIdPhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        const companyIdPhoto = ctx.update.message.photo[0].file_id;
        // const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${companyIdPhoto}`);
        // console.log(res);
        // const res2 = await res.json();
        // const filePath = res2.result.file_path;
        // const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
        // console.log(downloadURL);
        // download(downloadURL, path.join(('companyRepOrGMidPhotos'), `${ctx.from.id}.jpg`), () =>
        // console.log('Done!')
        // )
        ctx.replyWithHTML(`please enter photo of stamped letter.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter avalid id photo!`, cancelKeyboard);
        return;
    }
})
export const companyStampedLetterPhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        const companyStampedLetterPhoto = ctx.update.message.photo[0].file_id;
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
        ctx.replyWithHTML(`Please enter avalid stamped letter photo!`, cancelKeyboard);
        return;
    }
})
export const companyIndustrySectorRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.companyRSectorName })
        if (data) {
            const { sectors } = data
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
                ctx.session.companyRSectorID = sectorId;
                ctx.scene.state.companyRSectorID = sectorId;
                ctx.replyWithHTML("please enter employee size of your company.", cancelKeyboard);
                return ctx.wizard.next();
            }
        }
    }
})
export const companyEmployeeSizeRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyREmployeeSize = ctx.message.text;
        console.log(ctx.scene.state.companyREmployeeSize);
        ctx.replyWithHTML(`please enter website of your company.`, companyRegisterOptionalKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid employee size of your company!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyWebsiteRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyRWebsite = " ";
        } else {
            ctx.scene.state.companyRWebsite = ctx.message.text;
        }
        await ctx.replyWithHTML(`please enter your company Email`, companyRegisterOptionalKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyEmailRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyREmail = " ";
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        } else {
            ctx.scene.state.companyREmail = ctx.message.text;
            console.log(ctx.scene.state.companyREmail);
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }
    } else {
        ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard);
    }
})
export const companyOfficialPhoneNoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRPhoneNumber = ctx.message.text;
        const { data, error } = await fetchCities()
        if (data) {
            const { cities } = data;
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
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter valid official phone number of your company!`, cancelKeyboard);
        return;
    }
})
export const companyHeadQuarterLocationRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRHeadQuarterLocation = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.companyRHeadQuarterLocation })
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
            console.log("bpt 2", hqId)
            ctx.session.companyRHeadQuarterLocationId = hqId;
            ctx.scene.state.companyRHeadQuarterLocationId = hqId;
            globalState = ctx.scene.state;
            await ctx.replyWithHTML(`${globalState.companyRNameBold}\n . Name: ${globalState.companyRName}\n . Sectory: ${globalState.companyRSectorName}\n . Phone: ${globalState.companyRPhoneNumber}\n . Website: ${globalState.companyRWebsite}\n . Email: ${globalState.companyREmail}\n . Employee size: ${globalState.companyREmployeeSize}\n . HQ Location: ${globalState.companyRHeadQuarterLocation}\n\n\n\n\n\n...`, registerCompanyConfirmKeyboard);
        }
    } else {
        ctx.replyWithHTML(`please enter valid location of your company HQ!`, {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
        return;
    }
})

// register company with representative ends.

//register company with General manager starts here.

export const companyNameGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGName = ctx.message.text;
        console.log(ctx.scene.state.companyGName);
        ctx.scene.state.companyGNameBold = ctx.scene.state.companyGName.bold();
        ctx.replyWithHTML(`please send the photo of company trade license scanned photo.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid name!`, cancelKeyboard);
        return;
    }
})
export const companyTradeLicensePhotoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        console.log(ctx.update.message.photo[0])
        const companyTradeLicensePhoto = ctx.update.message.photo[0].file_id;
        // const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${companyTradeLicensePhoto}`);
        //    console.log(res);
        //    const res2 = await res.json();
        //    const filePath = res2.result.file_path;
        //    const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
        //    console.log(downloadURL);
        //    download(downloadURL, path.join(('companyTradeLicencePhotos'), `${ctx.from.id}.jpg`), () =>
        //    console.log('Done!')
        //    )
        ctx.replyWithHTML(`please enter General Manager id photo.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
})
export const companyIdPhotoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        const companyIdPhoto = ctx.update.message.photo[0].file_id;
        // const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${companyIdPhoto}`);
        // console.log(res);
        // const res2 = await res.json();
        // const filePath = res2.result.file_path;
        // const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
        // console.log(downloadURL);
        // download(downloadURL, path.join(('companyRepOrGMidPhotos'), `${ctx.from.id}.jpg`), () =>
        // console.log('Done!')            )
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
        ctx.replyWithHTML(`Please enter avalid id photo!`, cancelKeyboard);
        return;
    }
})

export const companyIndustrySectorGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        console.log(ctx.scene.state.companyGSectorName, "sector name")
        ctx.scene.state.companyGSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.companyGSectorName })
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
            console.log("bpt 2", sectorId)
            ctx.session.companyGSectorID = sectorId;
            ctx.scene.state.companyGSectorID = sectorId;
            ctx.replyWithHTML("please enter employee size of your company.", cancelKeyboard);
            return ctx.wizard.next();
        }
    }
})
export const companyEmployeeSizeGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGEmployeeSize = ctx.message.text;
        console.log(ctx.scene.state.companyGEmployeeSize);
        ctx.replyWithHTML(`please enter website of your company.`, companyRegisterOptionalKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid employee size of your company!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyWebsiteGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyRWebsite = " ";
        } else {
            ctx.scene.state.companyGWebsite = ctx.message.text;
        }
        await ctx.replyWithHTML(`please enter your company Email`, companyRegisterOptionalKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyEmailGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyGEmail = " ";
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        } else {
            ctx.scene.state.companyGEmail = ctx.message.text;
            console.log(ctx.scene.state.companyGEmail);
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }
    } else {
        ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard);
    }
})
export const companyOfficialPhoneNoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGPhoneNumber = ctx.message.text;
        const { data, error } = await fetchCities()
        if (data) {
            const { cities } = data;
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
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter valid official phone number of your company!`, cancelKeyboard);
        return;
    }
})
export const companyHeadQuarterLocationGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGHeadQuarterLocation = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
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
            console.log("bpt 2", hqId)
            ctx.session.companyGHeadQuarterLocationId = hqId;
            ctx.scene.state.companyGHeadQuarterLocationId = hqId;
            globalState = ctx.scene.state;
            await ctx.replyWithHTML(`${globalState.companyGNameBold}\n . Name: ${globalState.companyGName}\n . Sectory: ${globalState.companyGSectorName}\n . Phone: ${globalState.companyGPhoneNumber}\n . Website: ${globalState.companyGWebsite}\n . Email: ${globalState.companyGEmail}\n . Employee size: ${globalState.companyGEmployeeSize}\n . HQ Location: ${globalState.companyGHeadQuarterLocation}\n\n\n\n\n\n...`, registerCompanyConfirmGMKeyboard);
            //DO REST API CALL TO REGISTER THE COMPANY

        }
    } else {
        ctx.replyWithHTML(`please enter valid location of your company HQ!`, {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
        return;
    }
})

//register company with General manager ends here.



export const companySelectionActionHandler = async (ctx: any) => {
    // TODO: improve handler
    console.log("here")
    const selectedCompany = ctx.match[0];
    console.log(selectedCompany);
    const { data, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
   if(data){
    let checkUserEntity = data.users[0].user_entities;
    console.log(checkUserEntity)
    if(checkUserEntity){
        ctx.session.userCName = checkUserEntity.map((nam: any)=>(nam.entity["name"]))
         console.log(ctx.session.userCName)
        ctx.session.userCId = checkUserEntity.map((nam: any)=>nam.entity["id"])
            console.log(ctx.session.userCId);
      if(checkUserEntity = 30){
        ctx.session.selectedCompanyName = ctx.session.userUName[0];
       ctx.session.selectedCompanyId = ctx.session.userEId[0];
      }else if(checkUserEntity = 31){
        ctx.session.selectedCompanyName = ctx.session.userCName[1];
        ctx.session.selectedCompanyId = ctx.session.userCId[1]; 
      }else if(checkUserEntity = 32){
        ctx.session.selectedCompanyName = ctx.session.userEName[2];
        ctx.session.selectedCompanyId = ctx.session.userEId[2]; 
      }
      else if(checkUserEntity = 33){
        ctx.session.selectedCompanyName = ctx.session.userEName[3];
        ctx.session.selectedCompanyId = ctx.session.userEId[3]; 
      }
      else if(checkUserEntity = 34){
        ctx.session.selectedCompanyName = ctx.session.userEName[4];
        ctx.session.selectedCompanyId = ctx.session.userEId[4]; 
      }
      else if(checkUserEntity = 35){
        ctx.session.selectedCompanyName = ctx.session.userEName[4];
        ctx.session.selectedCompanyId = ctx.session.userEId[4]; 
      }
      else if(checkUserEntity = 36){
        ctx.session.selectedCompanyName = ctx.session.userEName[5];
        ctx.session.selectedCompanyId = ctx.session.userEId[5]; 
      }
      else if(checkUserEntity = 37){
        ctx.session.selectedCompanyName = ctx.session.userEName[6];
        ctx.session.selectedCompanyId = ctx.session.userEId[6]; 
      }
      else if(checkUserEntity = 38){
        ctx.session.selectedCompanyName = ctx.session.userEName[7];
        ctx.session.selectedCompanyId = ctx.session.userEId[7]; 
      }
      else if(checkUserEntity = 39){
        ctx.session.selectedCompanyName = ctx.session.userEName[8];
        ctx.session.selectedCompanyId = ctx.session.userEId[8]; 
      }
      else if(checkUserEntity = 40){
        ctx.session.selectedCompanyName = ctx.session.userEName[9];
        ctx.session.selectedCompanyId = ctx.session.userEId[9]; 
      }
      else if(checkUserEntity = 41){
        ctx.session.selectedCompanyName = ctx.session.userEName[10];
        ctx.session.selectedCompanyId = ctx.session.userEId[10]; 
      }

    console.log(ctx.session.selectedCompanyName);
    console.log(ctx.session.selectedCompanyId); 
    // for (let x = 0; x < ctx.session.userEName.length; x++) {
    //     if (parseInt(selectedCompany) === x) {
    //         ctx.session.selectedCompanyName = ctx.session.userEName[0];
    //         ctx.session.selectedCompanyId = ctx.session.userEId[0];
    //     }
    //     console.log(ctx.session.selectedCompanyName);
    //     console.log(ctx.session.selectedCompanyId);
    // }
    }
}
    // ctx.session.companyNames = 


    // const selectedSector = ctx.match[0];
    // const { data: { sectors } } = await fetchSectors()
    // ctx.session.sectorNames = sectors.map((e: any) => e.name);
    // ctx.session.sectorIds = sectors.map((e: any) => e.id)

    // for (let x = 0; x < sectors.length; x++) {
    //     if (parseInt(selectedSector) === x) {
    //         ctx.session.selectedSectorName = ctx.session.sectorNames[x];
    //         ctx.session.selectedSectorId = ctx.session.sectorIds[x];
    //     }
    // }
    // const { data } = await registerJobSeekerPersonalizedJob({
    //     objs: [{
    //         job_seeker_id: ctx.session.personalizedJobSeekerId,
    //         sector_id: ctx.session.selectedSectorId
    //     }]
    // })
    // if (data) {
    //     ctx.replyWithHTML(`You have selected ${ctx.session.selectedSectorName}`);
    // }
}
