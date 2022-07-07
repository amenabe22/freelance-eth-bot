import { cancelKeyboard, employerKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";

import { Telegraf } from "telegraf";
import * as kb from "../../keybaords/jobpost_kbs";
import { getUserByTelegramId, getUserByTelegramStEntId } from "../../services/registration";
import { fetchCities, fetchCity, fetchSector, fetchSectors } from "../../services/basic";
let globalState: any;
export const jobPostCancelButtonHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, employerKeyboard);
    ctx.scene.leave();
}

export const jobPostStartupSelectorActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const { data, error } = await getUserByTelegramStEntId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (data) {
        console.log(data);
        const checkUserEntity = data.users[0].user_entities;
        console.log(checkUserEntity)
        const myCompanies = checkUserEntity
        // 
        // apply verified filter once finished implementing logic
        //
        // const myCompanies = checkUserEntity.filter((company: any) => {
        //     if (company.entity["verified_at"] != null) {
        //         return true;
        //     }
        // });
        if (checkUserEntity) {
            // using job_cmp_300 company handler for both use separate if conditions are differnet
            ctx.replyWithHTML("Please select the company you want to post with.", {
                reply_markup: JSON.stringify({
                    inline_keyboard: myCompanies.map((x: any, xi: string) => ([{
                        text: x.entity.name, callback_data: `job_cmp_300${x.id}`
                    }]))
                })
            })
        }
    }

}
export const jobPostCompanySelectorActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    let companyClicked = ctx.match[0];
    console.log(companyClicked)
    ctx.session.postAJobCompanyName = companyClicked;
    ctx.scene.enter("postAJobScene");

}
export const jobPostCompanyActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const { data, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (data) {
        console.log(data);
        const checkUserEntity = data.users[0].user_entities;
        console.log(checkUserEntity)
        const myCompanies = checkUserEntity
        //
        // apply verified filter once finished implementing logic
        //        
        // const myCompanies = checkUserEntity.filter((company: any) => {
        //     if (company.entity["verified_at"] != null) {
        //         return true;
        //     }
        // });
        if (checkUserEntity) {
            ctx.replyWithHTML("Please select the company you want to post with.", {
                reply_markup: JSON.stringify({
                    inline_keyboard: myCompanies.map((x: any, xi: string) => ([{
                        text: x.entity.name, callback_data: `job_cmp_300${x.id}`
                    }]))
                })
            })
            // ctx.replyWithHTML("back to main menu.", onlyMainMenuKeyboard);
        }
    }
}
export const postAJobInitHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name} lets start you job posting Process\n\nPlease enter your job title.`, cancelKeyboard);
}

export const postJobMenuSelectionHandler = async (ctx: any) => {
    await ctx.replyWithHTML("Please select with which you want to post ajob.", kb.choosePostJobKeyboard);
    await ctx.replyWithHTML("Main Menu", onlyMainMenuKeyboard);
}

export const postAJobNameHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobName = ctx.message.text;
        await ctx.replyWithHTML(`Awsome ${ctx.from.first_name}, Please enter job description.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(ctx.chat.id, `Please enter a valid Job Name!`, cancelKeyboard);
        return;
    }
})

export const postAJobDescriptionHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobDescription = ctx.message.text;
        await ctx.replyWithHTML(`You are doing great ${ctx.from.first_name}, please enter job type.`, kb.postAJobTypeKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job description!`, cancelKeyboard);
        return;
    }
})
export const postAJobTypeHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobType = ctx.message.text;
        const { data, error } = await fetchSectors()
        if (data) {
            const { sectors } = data;
            let snames = sectors.map((nm: any) => nm.name);
            ctx.session.sectorNames = snames;
            let secs = snames.map((x: string, _: string) => ([{
                text: x,
            }]))
            secs.push([{text: "Skip"}],[{ text: "Back" }])
            ctx.replyWithHTML("please enter sector type for your Job.", {
                reply_markup: JSON.stringify({
                    keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                }),
            })
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job type!`, kb.postAJobTypeKeyboard);
        return;
    }
})
export const postAjobSectorHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        if(ctx.message.text == "Skip"){
            ctx.scene.state.postAJobSector = " ";
            await ctx.replyWithHTML(`Alright please enter job salary.`, kb.postAJobOptionalKeyboard);
            return ctx.wizard.next(); 
        }else{
            ctx.scene.state.postAJobSector = ctx.message.text;
            const { data, error } = await fetchSector({ name: ctx.scene.state.postAJobSector })
            if (data) {
                const { sectors } = data
                let secs = ctx.session.sectorNames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{text: "Skip"}],[{ text: "Back" }])

                if (!sectors.length) {
                    ctx.replyWithHTML("please enter valid sector!", {
                        reply_markup: JSON.stringify({
                            keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let sectorId = sectors[0].id;
                    console.log("bpt 2", sectorId)
                    ctx.session.postAJobSectorId = sectorId;
                    ctx.scene.state.postAJobSectorId = sectorId;
                    await ctx.replyWithHTML(`Alright please enter job salary.`, kb.postAJobOptionalKeyboard);
                    return ctx.wizard.next();
                }
            }
        }
           
    } else {
        ctx.replyWithHTML(`Please enter a valid job sector!`, kb.postAJobSectorKeyboard);
        return;
    }
})

export const postAJobSalaryHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.postAJobSalary = " ";
            const { data, error } = await fetchCities()
            if (data) {
                const { cities } = data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                let fkbs = cnames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                fkbs.push([{text: "Skip"}],[{ text: "Back" }])
                ctx.replyWithHTML("Awsome, please enter job working location.", {
                    reply_markup: JSON.stringify({
                        keyboard: fkbs, resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
        } else {
            ctx.scene.state.postAJobSalary = ctx.message.text;
              const { data, error } = await fetchCities()
            if (data) {
                const { cities } = data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                let fkbs = cnames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                fkbs.push([{text: "Skip"}],[{ text: "Back" }])
                ctx.replyWithHTML("Awsome, please enter job working location.", {
                    reply_markup: JSON.stringify({
                        keyboard: fkbs, resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job salary!`, kb.postAJobOptionalKeyboard);
        return;
    }
})
export const postAJobWorkingLocationHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.postAJobWorkingLocation = " ";
            await ctx.replyWithHTML(`Almost done ${ctx.from.first_name}, please enter job applicant needed.`, kb.postAJobOptionalKeyboard);
            return ctx.wizard.next();
        } else {
            ctx.scene.state.postAJobWorkingLocation = ctx.message.text;
            const { data, error } = await fetchCity({ name: ctx.scene.state.postAJobWorkingLocation })
            const { cities } = data
            if (!cities.length) {
                let fkbs = ctx.session.cityNames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                fkbs.push([{text: "Skip"}],[{ text: "Back" }])
                ctx.replyWithHTML("Please enter a valid location of your job!", {
                    reply_markup: JSON.stringify({
                        keyboard: fkbs, resize_keyboard: true, one_time_keyboard: true,
                        }),
                })
                return;
            } else {
                let hqId = cities[0].id;
                ctx.session.postAJobWorkingLocationId = hqId;
                ctx.scene.state.postAJobWorkingLocationId = hqId;
            }
            await ctx.replyWithHTML(`Almost done ${ctx.from.first_name}, please enter job applicant needed.`, kb.postAJobOptionalKeyboard);
            return ctx.wizard.next();
        }     
    } else {
        ctx.replyWithHTML(`Please enter a valid working location!`, kb.postAJobOptionalKeyboard);
        return;
    }
})
export const postAjobApplicantNeededHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobApplicantNeeded = ctx.message.text;
        await ctx.replyWithHTML(`One last thing ${ctx.from.first_name}, please enter Vacancy number.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job applicant needed!`, kb.postAJobOptionalKeyboard);
        return;
    }
})
export const postAJobVacancyHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobVancancyNumber = ctx.message.text;
        ctx.session.postAJobName = ctx.scene.state.postAJobName;
        console.log(ctx.session.postAJobName);
        ctx.session.postAJobDescription = ctx.scene.state.postAJobDescription;
        console.log(ctx.session.postAJobDescription);
        ctx.session.postAJobType = ctx.scene.state.postAJobType;
        console.log(ctx.session.postAJobType);
        ctx.session.postAJobSector = ctx.scene.state.postAJobSector;
        console.log(ctx.session.postAJobSector);
        ctx.session.postAJobSalary = ctx.scene.state.postAJobSalary;
        console.log(ctx.session.postAJobSalary);
        ctx.session.postAJobWorkingLocation = ctx.scene.state.postAJobWorkingLocation;
        console.log(ctx.session.postAJobWorkingLocation);
        ctx.session.postAJobApplicantNeeded = ctx.scene.state.postAJobApplicantNeeded;
        console.log(ctx.session.postAJobApplicantNeeded);
        ctx.session.postAJobVancancyNumber = ctx.scene.state.postAJobVancancyNumber;
        console.log(ctx.session.postAJobVancancyNumber);
        ctx.session.postAJobCompanyNameBold = ctx.session.postAJobCompanyName.bold();
        globalState = ctx.scene.state;
        ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.confirmPostJobKeyboard);
    } else {
        ctx.replyWithHTML(`Please enter a valid job close date!`, cancelKeyboard);
        return;
    }
})

export const jobPostConfirmHandler = async (ctx: any) => {
    ctx.deleteMessage();
    // Do the logic to register job post
    ctx.replyWithHTML(`Congradulations you have post a job to ${ctx.session.postAJobCompanyNameBold} company successfully.`, cancelKeyboard);
}
export const jobPostEditInitHandler = async (ctx: any) => {
    ctx.deleteMessage();
    ctx.replyWithHTML(`Please select which field to edit`, kb.editJobPostKeyboard);
}
export const jobPostingSelectedFieldEditHandler = async (ctx: any) => {
    ctx.deleteMessage();
    let editTarget = ctx.match[0].split('-')[1];
    console.log(editTarget);
    ctx.session.editTarget = editTarget;
    ctx.scene.enter("editJobPostScene", ctx.scene.state);
}

export const editPostAJobInitHandler = async (ctx: any) => {
    const target = ctx.session.editTarget 
    console.log("1", target)
    switch (target) {
        case "title":
            ctx.replyWithHTML("Please enter new title for your Job.", cancelKeyboard);
            return
        case "description":
            ctx.replyWithHTML("Please enter new description for your Job.", cancelKeyboard);
            return   
        case "type":
            ctx.replyWithHTML("please enter new job type for your job.", kb.postAJobTypeKeyboard);
            return
        case "sector":
            const { data, error } = await fetchSectors()
            if (data) {
                const { sectors } = data;
                let snames = sectors.map((nm: any) => nm.name);
                ctx.session.sectorNames = snames;
                let secs = snames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{ text: "Back" }])
                ctx.replyWithHTML("please enter new sector for your Job.", {
                    reply_markup: JSON.stringify({
                        keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        case "salary":
            ctx.replyWithHTML(`please enter your new salary for your job.`, cancelKeyboard);
            return
        case "applicant":
            ctx.replyWithHTML(`please enter new applicant limits for your job.`, cancelKeyboard);
            return
        case "vacancy":
            ctx.replyWithHTML(`please enter new vancany number of your job.`, cancelKeyboard);
            return           
        case "location":
            const res = await fetchCities()
            if (res.data) {
                const { cities } = res.data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                ctx.replyWithHTML("please enter location for your job.", {
                    reply_markup: JSON.stringify({
                        keyboard: cnames.map((x: string, _: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        case "done":
            ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.confirmPostJobKeyboard);
            return     
        default:
            break;
    }
}


export const editpostAJobValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {    
    const response = ctx.message.text
    const target = ctx.session.editTarget
    if (response) {
         switch (target) {
            case "title":
                globalState.postAJobName = response
               await ctx.reply("title Updated, you can edit more fileds here")
               await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
               break;
            case "description":
                globalState.postAJobDescription = response
                await ctx.reply ("Description Updated, you can edit more fileds here");
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                break;
            case "type":
                globalState.postAJobType = response
                await ctx.reply("job type Updated, you can edit more fileds here")
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                break;
            case "sector":
                globalState.postAJobSector = response
                ctx.scene.state.postAJobSector = response;
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
                    ctx.session.postAJobSector = sectorId;
                    ctx.scene.state.postAJobSector = sectorId;
                    ctx.reply("Sector Updated, you can edit more fileds here")
                    await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                    break;
                }
            case "salary":
                globalState.companyRPhoneNumber = response
                ctx.reply("salary Updated, you can edit more fileds here")
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                break;
            case "applicant":
                globalState.companyRWebsite = response
                ctx.reply("applicant num Updated, you can edit more fileds here")
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                break;
            case "vacancy":
                globalState.postAJobVancancyNumber = response
                ctx.reply("vacancy num Updated, you can edit more fileds here")
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                break;
            case "location":
                globalState.postAJobLocation = response
                const res = await fetchCity({ name: globalState.postAJobLocation })
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
                    ctx.session.postAJobLocation = hqId;
                    ctx.scene.state.postAJobLocation = hqId;
                    globalState = ctx.scene.state;
                }
                ctx.reply("Updated HeadQuarters, you can edit more fileds here")
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);                
                return;
            case "done":
                ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.confirmPostJobKeyboard);
                break;        
        }
    }
})