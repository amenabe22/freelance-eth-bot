import { Telegraf, Context } from "telegraf";
// import request  from "request";
// import fs from "fs";
import { fetchCities, fetchCity } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import {
    startupRegisterOptionalKeyboard,
} from "../../keybaords/company.registration_kbs"

// const download = (url, path, callback) => {
//     request.head(url, (err, res, body) => {
//     request(url).pipe(fs.createWriteStream(path)).on('close', callback);
//   });
// };
   //licensed startup registration with General manager startes here...
   
   export const startupLGMNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.startupLGMName = ctx.message.text;
            console.log(ctx.scene.state.startupLGMName);
            ctx.replyWithHTML(`please enter startup founder name 1.`, cancelKeyboard);
            return ctx.wizard.next();      
    }else{
        ctx.replyWithHTML( `Please enter a valid startup G/M name!`, cancelKeyboard);
        return;  
    }    
})
export const startupLGMFounder1Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        ctx.scene.state.startupLGMFounder1 = ctx.message.text;
        ctx.replyWithHTML( `please enter startup founder name 2. `, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML( `please enter a valid startup fundar name 1!`, startupRegisterOptionalKeyboard);
        return; 
    }
})
export const startupLGMFounder2Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLGMFounder2 = ctx.message.text;
      ctx.replyWithHTML( `please enter startup founder name 3.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML( `Please enter a valid startup founder name 2!`, startupRegisterOptionalKeyboard);
      return; 
  }
})
export const startupLGMFounder3Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLGMFounder3 = ctx.message.text;
      ctx.replyWithHTML( `please enter startup founder name 4.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML( `Please enter a valid startup founder name 3!`, startupRegisterOptionalKeyboard);
      return; 
  }
})
export const startupLGMFounder4Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLGMFounder4 = ctx.message.text;
      ctx.replyWithHTML( `please enter startup founder name 5. `, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML( `Please enter a valid startup founder name 4!`, startupRegisterOptionalKeyboard);
      return; 
  }
})
export const startupLGMFounder5Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLGMFounder5 = ctx.message.text;
      ctx.replyWithHTML( `please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML( `Please enter a valid startup founder name 5!`, startupRegisterOptionalKeyboard);
      return; 
  }
})
export const startupLGMTradeLicensePhotoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
            ctx.scene.state.startupTradeLicensePhoto = ctx.update.message.photo;
            console.log(ctx.scene.state.startupTradeLicensePhoto);
            console.log(ctx.update.message.photo[0])       
                const startupTradeLicensePhoto = ctx.update.message.photo[0].file_id;
                const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${startupTradeLicensePhoto}`);
                   console.log(res);
                   const res2 = await res.json();
                   const filePath = res2.result.file_path;
                   const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
                   console.log(downloadURL);
                //    download(downloadURL, path.join(('startupTradeLicencePhotos'), `${ctx.from.id}.jpg`), () =>
                //    console.log('Done!')
                //    )
            ctx.replyWithHTML( `please enter G/M id photo.`, cancelKeyboard);  
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML( `Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
})
export const startupLGMIdPhotoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
            ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
            console.log(ctx.scene.state.startupIdPhoto);
                const startupIdPhoto = ctx.update.message.photo[0].file_id;
                const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${startupIdPhoto}`);
                   console.log(res);
                   const res2 = await res.json();
                   const filePath = res2.result.file_path;
                   const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
                   console.log(downloadURL);
                //    download(downloadURL, path.join(('startupRepOrGMidPhotos'), `${ctx.from.id}.jpg`), () =>
                //    console.log('Done!')
                //    )
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
        ctx.replyWithHTML( `Please enter avalid G/M id photo!`, cancelKeyboard);
        return;  
    }
})
export const startupLGMIndustrySectorHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        ctx.scene.state.startupLGMSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.startupLGMSectorName})
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
   }else {
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
export const startupLGMEmployeeSizeHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLGMEmployeeSize = " ";  
        }else{
            ctx.scene.state.startupLGMEmployeeSize = ctx.message.text; 
        }
        console.log(ctx.scene.state.startupLGMEmployeeSize);
        ctx.replyWithHTML(`please enter startup website.`,startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid employee size of your startup!`,startupRegisterOptionalKeyboard);  
        return;
    } 
})
export const startupLGMWebsiteHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.startupLGMWebsite = " ";
      }else{
        ctx.scene.state.startupLGMWebsite = ctx.message.text;
      }        
        ctx.replyWithHTML( `please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
        return;
    }
})
export const startupLGMFacebookLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLGMFacebookLink = " ";  
        }else{
            ctx.scene.state.startupLGMFacebookLink = ctx.message.text; 
        }
            console.log(ctx.scene.state.startupLGMFacebookLink);
            ctx.replyWithHTML(`please enter Telegram link of your startup.`,startupRegisterOptionalKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid Facebook link of your startup!`,startupRegisterOptionalKeyboard);
        return;
    }
})
export const startupLGMTelegramLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMTelegramLink = " ";  
      }else{
          ctx.scene.state.startupLGMTelegramLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMTelegramLink);
          ctx.replyWithHTML(`please enter YouTube link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid Telegram link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMYouTubeLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMYouTubeLink = " ";  
      }else{
          ctx.scene.state.startupLGMYouTubeLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMYouTubeLink);
          ctx.replyWithHTML(`please enter Tiktok link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid YouTube link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMTikTokLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMTikTokLink = " ";  
      }else{
          ctx.scene.state.startupLGMTikTokLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMTikTokLink);
          ctx.replyWithHTML(`please enter Twitter link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMTwitterLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMTwitterLink = " ";  
      }else{
          ctx.scene.state.startupLGMTwitterLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMTwitterLink);
          ctx.replyWithHTML(`please enter other Link 1 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMOtherLink1Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMOther1Link = " ";  
      }else{
          ctx.scene.state.startupLGMOther1Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMOther1Link);
          ctx.replyWithHTML(`please enter other link 2 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMOtherLink2Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMOther2Link = " ";  
      }else{
          ctx.scene.state.startupLGMOther2Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMOther2Link);
          ctx.replyWithHTML(`please enter other link 3 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter ohter link 2 of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMOtherLink3Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLGMOther3Link = " ";  
      }else{
          ctx.scene.state.startupLGMOther3Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLGMOther3Link);
          ctx.replyWithHTML(`please enter email of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
})
export const startupLGMEmailHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{    
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLGMEmail = " ";  
        }else{
            ctx.scene.state.startupLGMEmail = ctx.message.text; 
        }
            console.log(ctx.scene.state.startupLGMEmail);
            ctx.replyWithHTML( `please enter your startup official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML( `please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
    }    
})
export const startupOfficialPhoneNoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{   
    if(ctx.message.text){
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
    }else{
        ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
        return;
    }    
})
export const startupHeadQuarterLocationHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        ctx.scene.state.startupLGMHeadQuarterLocation = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.startupLGMHeadQuarterLocation })
        const { cities } = data
        console.log(cities.length, "bpt 1")
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
        }
      }else{
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
 //licensed startup registration with General manager ends here...

//Unlicensed startup registration by General Manager handler  starts here.
export const startupUGMNameHandler = Telegraf.on("text", (ctx :any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMName = ctx.message.text;
      console.log(ctx.scene.state.startupUGMName)
      ctx.replyWithHTML( `please enter the name of your startup founder name.`, cancelKeyboard);
      return ctx.wizard.next();
    }
  })
  export const startupUGMFirstFounderNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
       ctx.scene.state.startupUGMFounder1Name = ctx.message.text;
       console.log(ctx.scene.state.startupUGMFounder1Name);
       ctx.replyWithHTML( `please add more founder name or click done`,{
         parse_mode: "HTML",
         reply_markup: {
           keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
         }
       })
       return ctx.wizard.next();
      }
  })
  export const startupUGMFounderNameHandler = Telegraf.on(["text", "contact", "photo", "document"], (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Add More Founder"){
        ctx.replyWithHTML( `please enter another name of your startup founder.`,cancelKeyboard);
        return ctx.wizard.next();
      }else if(ctx.message.text == "Done"){
        ctx.scene.enter("startupRegisterFounderNameDoneScene");
      }else{
        ctx.replyWithHTML( `sorry I don't understand`, {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
          }
        });
      }
      return
    }
  
  })
  export const startupUGMSecondFounderNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMFounder2Name = ctx.message.text;
      console.log(ctx.scene.state.startupUGMFounder2Name)
      ctx.replyWithHTML( `please add more founder name or click done`,{
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
        }
      })
      return ctx.wizard.next();
     }
  })
  export const startupUGMFounderNameeHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Add More Founder"){
        ctx.replyWithHTML( `please enter another name of your startup founder`,cancelKeyboard);
        return ctx.wizard.next();
      }else if(ctx.message.text == "Done"){
        ctx.scene.enter("startupRegisterFounderNameDoneScene");
      }else{
        ctx.replyWithHTML( `sorry I don't understand`, {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
          }
        });
       return;
      }
    }
  })
  export const startupUGMThirdFounderNameHandler = Telegraf.on(["photo", "text","contact", "document"], (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMFounder3Name = ctx.message.text;
      ctx.replyWithHTML( `please add more founder name or click done`,{
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
        }
      })
      return ctx.wizard.next();
     } 
  })
  export const startupUGMFounderNameeeHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Add More Founder"){
        ctx.replyWithHTML( `please enter another name of your startup founder`,cancelKeyboard);
        return ctx.wizard.next();
      }else if(ctx.message.text == "Done"){
        ctx.scene.enter("startupRegisterFounderNameDoneScene");
      }else{
        ctx.replyWithHTML( `sorry I don't understand`, {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
          }
        });
        return;
      }
    }
  })
  export const startupUGMForthNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMFounder4Name = ctx.message.text;
      ctx.replyWithHTML( `please add more founder name or click done`,{
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
        }
      })
      return ctx.wizard.next();
     } 
  })
  export const startupUGMFounderNameeeeeHandeler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Add More Founder"){
        ctx.replyWithHTML( `please enter another name of your startup founder`,cancelKeyboard);
        return ctx.wizard.next();
      }else if(ctx.message.text == "Done"){
        ctx.scene.enter("startupRegisterFounderNameDoneScene");
      }else{
        ctx.replyWithHTML( `sorry I don't understand`, {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [[{text: "Add More Founder"}, {text: "Done"}],[{text: "Cancel"}],],resize_keyboard: true, one_time_keyboard: true,
          }
        });
        return;
      }
    }
  })
  export const startupUGMFifthNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMFounder4Name = ctx.message.text;
    }
    ctx.replyWithHTML( `please enter trade license photo of your startup`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
  })
  export const startupUGMTradeLicenseHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
   return ctx.wizard.next();
    }else if(ctx.message.text && ctx.message.text == "Skip"){
      ctx.replyWithHTML( `please enter general manager Id photo`, cancelKeyboard);
      return ctx.wizard.next();
    }else{
      ctx.replyWithHTML( ` Sorry I don't understand`,startupRegisterOptionalKeyboard);
      return
    }
  })
  export const startupUGMIdPhotoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
   if(ctx.message.message_id.photo){
    ctx.replyWithHTML( `please enter employee size of your startup`, startupRegisterOptionalKeyboard);
    return ctx.wizard.next();
   }else if(ctx.message.text && ctx.message.text == "Skip"){
     ctx.replyWithHTML( `please enter employee size of your startup`, startupRegisterOptionalKeyboard);
     return ctx.wizard.next();
   }else{
    ctx.replyWithHTML( ` Sorry I don't understand`,startupRegisterOptionalKeyboard);
    return
   }
  })
  export const startupUGMEmployeeSizeHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.startupUGMEmployeeSize == " ";
      }else{
        ctx.scene.state.startupUGMEmployeeSize = ctx.message.text;
      }
      ctx.replyWithHTML( `please enter website of your startup`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
    }else{
      ctx.replyWithHTML( `please enter avalid employee size`, startupRegisterOptionalKeyboard);
      return;
    }
  })
  export const startupUGMWebsiteHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
       ctx.scene.state.startupUGMWebsite = " ";
      }else{
        ctx.scene.state.startupUGMWebsite = ctx.message.text;
      }
      ctx.replyWithHTML( `please enter sector of your startup`, cancelKeyboard);
      return ctx.wizard.next();
    }else{
      ctx.replyWithHTML( `sorry I dont understand`, startupRegisterOptionalKeyboard);
      return;
    }
  })
  export const startupUGMSectorHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.startupUGMSectorName = " ";
      }else{
        ctx.scene.state.startupUGMSectorName = ctx.message.text; 
      }
      ctx.replyWithHTML( `please enter your startup email.`, startupRegisterOptionalKeyboard)
      return ctx.wizard.next();
    }else{
      ctx.replyWithHTML( `please enter a valid sector name.`, startupRegisterOptionalKeyboard);
    }
    return;
  })
  export const startupUGMPhoneNumberHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
     if(ctx.message.text){
       ctx.scene.state.startupUGMPhoneNumber = ctx.message.text;
       ctx.replyWithHTML( `please enter your startup head quarter location`, cancelKeyboard);
       return ctx.wizard.next();
     }else{
       ctx.replyWithHTML( `please enter a valid Phone No!`, cancelKeyboard);
       return ctx.wizard.next();
     }
  })
  export const startupUGMHeadQuarterLocationHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupUGMHeadQuarterLocation = ctx.message.text;
      ctx.replyWithHTML( `congradulations your startup is registered successfully`, cancelKeyboard);
    }else{
      ctx.replyWithHTML( `please enter a valid location of your startup.`, cancelKeyboard);
    }
  })

  //Unicensed startup registration with General manager endes here...


  //licensed startup registraion with Representative starts here...

  export const startupLRNameHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
            ctx.scene.state.startupLRName = ctx.message.text;
            console.log(ctx.scene.state.startupLRName);
            ctx.replyWithHTML(ctx.chat.id, `please enter startup founder name 1.`, cancelKeyboard);
            return ctx.wizard.next();      
    }else{
        ctx.replyWithHTML(`Please enter a valid startup G/M name!`, cancelKeyboard);
        return;  
    }    
  })
  export const startupLRFounder1Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        ctx.scene.state.startupLRFounder1 = ctx.message.text;
        ctx.replyWithHTML(`please enter startup founder name 2. `, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter a valid startup fundar name 1!`, startupRegisterOptionalKeyboard);
        return; 
    }
  })
 export const startupLRFounder2Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLRFounder2 = ctx.message.text;
      ctx.replyWithHTML(`please enter startup founder name 3.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`Please enter a valid startup founder name 2!`, startupRegisterOptionalKeyboard);
      return; 
  }
  })
 export const startupLRFounder3Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLRFounder3 = ctx.message.text;
      ctx.replyWithHTML(`please enter startup founder name 4.`, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`Please enter a valid startup founder name 3!`, startupRegisterOptionalKeyboard);
      return; 
  }
  })
 export const startupLRFounder4Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLRFounder4 = ctx.message.text;
      ctx.replyWithHTML(`please enter startup founder name 5. `, startupRegisterOptionalKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`Please enter a valid startup founder name 4!`, startupRegisterOptionalKeyboard);
      return; 
  }
  })
 export const startupLRFounder5Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      ctx.scene.state.startupLRFounder5 = ctx.message.text;
      ctx.replyWithHTML(`please send the photo of startup trade license scanned photo. `, cancelKeyboard);
      return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`Please enter a valid startup founder name 5!`, startupRegisterOptionalKeyboard);
      return; 
  }
  })
 export const startupLRTradeLicensePhotoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
            ctx.scene.state.startupTradeLicensePhoto = ctx.update.message.photo;
            console.log(ctx.scene.state.startupTradeLicensePhoto);
            console.log(ctx.update.message.photo[0])       
                const startupTradeLicensePhoto = ctx.update.message.photo[0].file_id;
                const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${startupTradeLicensePhoto}`);
                   console.log(res);
                   const res2 = await res.json();
                   const filePath = res2.result.file_path;
                   const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
                   console.log(downloadURL);
                //    download(downloadURL, path.join(('startupTradeLicencePhotos'), `${ctx.from.id}.jpg`), () =>
                //    console.log('Done!')
                //    )
            ctx.replyWithHTML(`please enter Representative id photo.`, cancelKeyboard);  
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard);
        return;
    }
  })
 export const startupLRIdPhotoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.update.message.photo){
            ctx.scene.state.startupIdPhoto = ctx.update.message.photo;
            console.log(ctx.scene.state.startupIdPhoto);
                const startupIdPhoto = ctx.update.message.photo[0].file_id;
                const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${startupIdPhoto}`);
                   console.log(res);
                   const res2 = await res.json();
                   const filePath = res2.result.file_path;
                   const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
                   console.log(downloadURL);
                //    download(downloadURL, path.join(('startupLRepOrGMidPhotos'), `${ctx.from.id}.jpg`), () =>
                //    console.log('Done!')
                //    )
    ctx.replyWithHTML(`please enter Representative stamped letter`, cancelKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`Please enter avalid G/M id photo!`, cancelKeyboard);
        return;  
    }
  })
 export const startupLRStampedLetterHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any) => {
    if(ctx.update.message.photo){
        const startupStampedPhoto = ctx.update.message.photo[0].file_id;
        const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${startupStampedPhoto}`);
           console.log(res);
           const res2 = await res.json();
           const filePath = res2.result.file_path;
           const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
           console.log(downloadURL);
        //    download(downloadURL, path.join(('startupStampedLetterPhotos'), `${ctx.from.id}.jpg`), () =>
        //    console.log('Done!')
        //    )
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
      ctx.replyWithHTML(`please enter a valid Stamped letter photo!`, cancelKeyboard);
    }
  
  })
 export const startupLRIndustrySectorHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        ctx.scene.state.startupLRSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.startupLRSectorName})
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
            ctx.session.startupLRSectorID = sectorId;
            ctx.scene.state.startupLRSectorID = sectorId;
        ctx.replyWithHTML(`please enter employee size of your startup.`, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
       }
   }else {
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
 export const startupLREmployeeSizeHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLREmployeeSize = " ";  
        }else{
            ctx.scene.state.startupLREmployeeSize = ctx.message.text; 
        }
        console.log(ctx.scene.state.startupLREmployeeSize);
        ctx.replyWithHTML(`please enter startup website.`,startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid employee size of your startup!`,startupRegisterOptionalKeyboard);  
        return;
    } 
  })
 export const startupLRWebsiteHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      if(ctx.message.text == "Skip"){
        ctx.scene.state.startupLRWebsite = " ";
      }else{
        ctx.scene.state.startupLRWebsite = ctx.message.text;
      }        
        ctx.replyWithHTML(`please enter Facebook link of your startup.`, startupRegisterOptionalKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter a valid startup website!`, startupRegisterOptionalKeyboard);
        return;
    }
  })
export  const startupLRFacebookLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLRFacebookLink = " ";  
        }else{
            ctx.scene.state.startupLRFacebookLink = ctx.message.text; 
        }
            console.log(ctx.scene.state.startupLRFacebookLink);
            ctx.replyWithHTML(`please enter Telegram link of your startup.`,startupRegisterOptionalKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid Facebook link of your startup!`,startupRegisterOptionalKeyboard);
        return;
    }
  })
export  const startupLRTelegramLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLRTelegramLink = " ";  
      }else{
          ctx.scene.state.startupLRTelegramLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLRTelegramLink);
          ctx.replyWithHTML(`please enter YouTube link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid Telegram link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
export  const startupLRYouTubeLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLRYouTubeLink = " ";  
      }else{
          ctx.scene.state.startupLRYouTubeLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLRYouTubeLink);
          ctx.replyWithHTML(`please enter Tiktok link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid YouTube link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
export const startupLRTikTokLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLRTikTokLink = " ";  
      }else{
          ctx.scene.state.startupLRTikTokLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLRTikTokLink);
          ctx.replyWithHTML(`please enter Twitter link of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
 export const startupLRTwitterLinkHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLRTwitterLink = " ";  
      }else{
          ctx.scene.state.startupLRTwitterLink = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLRTwitterLink);
          ctx.replyWithHTML(`please enter other Link 1 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid TikTok link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
 export const startupLROtherLink1Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLROther1Link = " ";  
      }else{
          ctx.scene.state.startupLROther1Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLROther1Link);
          ctx.replyWithHTML(`please enter other link 2 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid link of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
 export const startupLROtherLink2Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLROther2Link = " ";  
      }else{
          ctx.scene.state.startupLROther2Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLROther2Link);
          ctx.replyWithHTML(`please enter other link 3 of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter ohter link 2 of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
 export const startupLROtherLink3Handler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
  if(ctx.message.text){
      if(ctx.message.text == "Skip"){
          ctx.scene.state.startupLROther3Link = " ";  
      }else{
          ctx.scene.state.startupLROther3Link = ctx.message.text; 
      }
          console.log(ctx.scene.state.startupLROther3Link);
          ctx.replyWithHTML(`please enter email of your startup.`,startupRegisterOptionalKeyboard);
          return ctx.wizard.next();
  }else{
      ctx.replyWithHTML(`please enter valid other link 3 of your startup!`,startupRegisterOptionalKeyboard);
      return;
  }
  })
 export const startupLREmailHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any) => {    
    if(ctx.message.text){
        if(ctx.message.text == "Skip"){
            ctx.scene.state.startupLREmail = " ";  
        }else{
            ctx.scene.state.startupLREmail = ctx.message.text; 
        }
            console.log(ctx.scene.state.startupLREmail);
            ctx.replyWithHTML(`please enter your startup official phone number.`, cancelKeyboard);
            return ctx.wizard.next();
    }else{
        ctx.replyWithHTML(`please enter valid email address of your startup!`, startupRegisterOptionalKeyboard);
    }    
  })
 export const startupLROfficialPhoneNoHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{   
    if(ctx.message.text){
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
    }else{
        ctx.replyWithHTML(`Please enter valid official phone number of your startup!`, cancelKeyboard);
        return;
    }    
  })
 export const startupLRHeadQuarterLocationHandler = Telegraf.on(["photo", "text","contact", "document"], async (ctx: any)=>{
    if(ctx.message.text){
      ctx.scene.state.startupLRHeadQuarterLocation = ctx.message.text;
      const { data, error } = await fetchCity({ name: ctx.scene.state.startupLRHeadQuarterLocation })
      const { cities } = data
      console.log(cities.length, "bpt 1")
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
      }
    }else{
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
    //licensed startup registration with representative ends here...

//unlicensed startup registration with Representative starts 



//unlicensed startup registraiton with representative ends here...



 