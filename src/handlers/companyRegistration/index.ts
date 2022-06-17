import { bot } from "../../setup";
import { Telegraf, Context } from "telegraf";
import request  from "request";
import fs from "fs";
import path from "path";
// import  fetch from 'node-fetch';
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import {
    companyRegisterOptionalKeyboard,
    registerCompanyConfirmKeyboard,
    registerCompanyConfirmGMKeyboard
} from "../../keybaords/company.registration_kbs";
let globalState: any;

const download = (url: any, path: any, callback: any) => {
    request.head(url, () => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};
 //register company with representative starts here
export const companyNameRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.companyRName = ctx.message.text;
            console.log(ctx.scene.state.companyRName);
            ctx.scene.state.companyRNameBold = ctx.scene.state.companyRName.bold();
            ctx.replyWithHTML(`please send the photo of company trade license scanned photo.`, cancelKeyboard);
            return ctx.wizard.next();               
    }else{
        ctx.replyWithHTML(`Please enter a valid name!`, cancelKeyboard);
        return;  
    }    
})
export const companyTradeLicensePhotoRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
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
    }else{
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
})
export const companyIdPhotoRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
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
    }else{
        ctx.replyWithHTML(`Please enter avalid id photo!`, cancelKeyboard);
        return;  
    }
})
export const companyStampedLetterPhotoRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
      if (ctx.update.message.photo) {
         const companyStampedLetterPhoto = ctx.update.message.photo[0].file_id;    
        //  const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${companyStampedLetterPhoto}`);
        //  console.log(res);
        //  const res2 = await res.json();
        //  const filePath = res2.result.file_path;
        //  const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
        //  console.log(downloadURL);
        //  download(downloadURL, path.join(('companyStampedLetterPhotos'), `${ctx.from.id}.jpg`), () =>
        //  console.log('Done!')
        //  )     
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
    }else{
        ctx.replyWithHTML(`Please enter avalid stamped letter photo!`, cancelKeyboard);
        return;
    }
})
export const companyIndustrySectorRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any) =>{
    if(ctx.message.text){
        ctx.scene.state.companyRSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.companyRSectorName})
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
            ctx.session.companyRSectorID = sectorId;
            ctx.scene.state.companyRSectorID = sectorId;
            ctx.replyWithHTML("please enter employee size of your company.", cancelKeyboard);
            return ctx.wizard.next();
        }
    }
})
export const companyEmployeeSizeRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.companyREmployeeSize = ctx.message.text; 
            console.log(ctx.scene.state.companyREmployeeSize);
            ctx.replyWithHTML(ctx.chat.id,`please enter website of your company.`,companyRegisterOptionalKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(ctx.chat.id,`please enter valid employee size of your company!`,companyRegisterOptionalKeyboard);  
        return;
    } 
})
export const companyWebsiteRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.companyRWebsite = " ";
      }else{
        ctx.scene.state.companyRWebsite = ctx.message.text;
      }
     await ctx.replyWithHTML(`please enter your company Email`, companyRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyEmailRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{    
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
            ctx.scene.state.companyREmail = " ";
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }else{
            ctx.scene.state.companyREmail = ctx.message.text;
            console.log(ctx.scene.state.companyREmail);
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }
    }else{
        ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard);
    }    
})
export const companyOfficialPhoneNoRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{   
    if(ctx.message.text){
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
    }else{
        ctx.replyWithHTML(`Please enter valid official phone number of your company!`, cancelKeyboard);
        return;
    }    
})
export const companyHeadQuarterLocationRHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
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
         await ctx.replyWithHTML(`${globalState.companyRNameBold}\n . Name: ${globalState.companyRName}\n . Sectory: ${globalState.companyRSectorName}\n . Phone: ${globalState.companyRPhoneNumber}\n . Website: ${globalState.companyRWebsite}\n . Email: ${globalState.companyREmail}\n . Employee size: ${globalState.companyREmployeeSize}\n . HQ Location: ${globalState.companyRHeadQuarterLocation}\n\n\n\n\n\n...`,registerCompanyConfirmKeyboard);    
      }        
    }else{
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

export const companyNameGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.companyGName = ctx.message.text;
            console.log(ctx.scene.state.companyGName);
            ctx.scene.state.companyGNameBold = ctx.scene.state.companyGName.bold();
            ctx.replyWithHTML(`please send the photo of company trade license scanned photo.`, cancelKeyboard);
            return ctx.wizard.next();               
    }else{
        ctx.replyWithHTML(`Please enter a valid name!`, cancelKeyboard);
        return;  
    }    
})
export const companyTradeLicensePhotoGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
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
    }else{
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
})
export const companyIdPhotoGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
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
    }else{
        ctx.replyWithHTML(`Please enter avalid id photo!`, cancelKeyboard);
        return;  
    }
})

export const companyIndustrySectorGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any) =>{
    if(ctx.message.text){
        ctx.scene.state.companyGSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.companyGSectorName})
        const { sectors } = data
        console.log(sectors)
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
            ctx.session.companyGSectorID = sectorId;
            ctx.scene.state.companyGSectorID = sectorId;
            ctx.replyWithHTML("please enter employee size of your company.", cancelKeyboard);
            return ctx.wizard.next();
        }
    }
})
export const companyEmployeeSizeGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.companyGEmployeeSize = ctx.message.text; 
            console.log(ctx.scene.state.companyGEmployeeSize);
            ctx.replyWithHTML(ctx.chat.id,`please enter website of your company.`,companyRegisterOptionalKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(ctx.chat.id,`please enter valid employee size of your company!`,companyRegisterOptionalKeyboard);  
        return;
    } 
})
export const companyWebsiteGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.companyRWebsite = " ";
      }else{
        ctx.scene.state.companyGWebsite = ctx.message.text;
      }
     await ctx.replyWithHTML(`please enter your company Email`, companyRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard);
        return;
    }
})
export const companyEmailGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{    
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
            ctx.scene.state.companyGEmail = " ";
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }else{
            ctx.scene.state.companyGEmail = ctx.message.text;
            console.log(ctx.scene.state.companyGEmail);
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
        }
    }else{
        ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard);
    }    
})
export const companyOfficialPhoneNoGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{   
    if(ctx.message.text){
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
    }else{
        ctx.replyWithHTML(`Please enter valid official phone number of your company!`, cancelKeyboard);
        return;
    }    
})
export const companyHeadQuarterLocationGHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
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
         await ctx.replyWithHTML(`${globalState.companyGNameBold}\n . Name: ${globalState.companyGName}\n . Sectory: ${globalState.companyGSectorName}\n . Phone: ${globalState.companyGPhoneNumber}\n . Website: ${globalState.companyGWebsite}\n . Email: ${globalState.companyGEmail}\n . Employee size: ${globalState.companyGEmployeeSize}\n . HQ Location: ${globalState.companyGHeadQuarterLocation}\n\n\n\n\n\n...`,registerCompanyConfirmGMKeyboard);    
      //DO REST API CALL TO REGISTER THE COMPANY
      
        }        
    }else{
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