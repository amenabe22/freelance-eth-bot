import { cancelKeyboard, employerKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";

import { Telegraf } from "telegraf";
import * as kb from "../../keybaords/jobpost_kbs";
import { fetchJobTypes, getUserByTelegramId, getUserByTelegramStEntId } from "../../services/registration";
import { fetchCities, fetchCity, fetchSector, fetchSectors } from "../../services/basic";
import { fetchJobById, fetchRatingQuestions, inserJobPost, jobTypeN } from "../../services/jobpost";

let globalState: any;

export const jobAppCancelButtonHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, employerKeyboard);
    ctx.scene.leave();
}

export const jobPostCancelButtonHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, employerKeyboard);
    ctx.scene.leave();
}

export const jobPostStartupSelectorActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    let companyClicked = ctx.match[0];
    console.log(companyClicked,".........")
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
        const vfCompany = myCompanies.filter((company: any) => {
            if (company.entity["verified_at"] != null) {
                return true;
            }
        });
        if (checkUserEntity) {
            // using job_cmp_300 company handler for both use separate if conditions are differnet
            ctx.replyWithHTML("Please select the company you want to post with.", {
                reply_markup: JSON.stringify({
                    inline_keyboard: vfCompany.map((x: any, xi: string) => ([{
                        text: x.entity.name, callback_data: `job_cmp_300${x.entity.id}`
                    }]))
                })
            })
        }
    }

}
export const jobPostCompanySelectorActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    let companyClicked = ctx.match[0].split("_");
    console.log(companyClicked,"dawg")
    ctx.session.postAJobCompanyName = companyClicked[2];
    ctx.scene.enter("postAJobScene");

}
export const jobPostPrivateSelectorActionHandler = async (ctx: any) => {
    ctx.deleteMessage();
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
        
        // apply verified filter once finished implementing logic
               
        const vfCompany = myCompanies.filter((company: any) => {
            if (company.entity["verified_at"] != null) {
                return true;
            }
        });
        if (checkUserEntity) {
            ctx.replyWithHTML("Please select the company you want to post with.", {
                reply_markup: JSON.stringify({
                    inline_keyboard: vfCompany.map((x: any, xi: string) => ([{
                        text: x.entity.name, callback_data: `job_cmp_300${x.entity.id}`
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
        const { data: { job_types } } = await fetchJobTypes()
        let jts = job_types.map((x: any, xi: any) => ([{
            text: x.name,
            callback_data: x.id,
        }]))

        ctx.replyWithHTML("Please enter job type.", {
            reply_markup: JSON.stringify({
                keyboard: jts, resize_keyboard: true, one_time_keyboard: true,
            }),
        })

        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job description!`, cancelKeyboard);
        return;
    }
})
export const postAJobTypeHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        const { data: { job_types } } = await jobTypeN({ name: ctx.message.text })
        console.log(JSON.stringify(ctx.message), ">>>>>>>>>>")
        if (job_types.length) {
            ctx.scene.state.postAJobType = job_types[0].id;
        }
        const { data, error } = await fetchSectors()
        if (data) {
            const { sectors } = data;
            let snames = sectors.map((nm: any) => nm.name);
            ctx.session.sectorNames = snames;
            let secs = snames.map((x: string, _: string) => ([{
                text: x,
            }]))

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
        if (ctx.message.text == "Skip") {
            ctx.scene.state.postAJobSector = " ";
            await ctx.replyWithHTML(`Alright please enter job salary.`, kb.postAJobOptionalKeyboard);
            return ctx.wizard.next();
        } else {
            ctx.scene.state.postAJobSector = ctx.message.text;
            const { data, error } = await fetchSector({ name: ctx.scene.state.postAJobSector })
            if (data) {
                const { sectors } = data
                let secs = ctx.session.sectorNames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{ text: "Skip" }], [{ text: "Back" }])

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
                fkbs.push([{ text: "Skip" }], [{ text: "Back" }])
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
                fkbs.push([{ text: "Skip" }], [{ text: "Back" }])
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
                fkbs.push([{ text: "Skip" }], [{ text: "Back" }])
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
        if(ctx.message.text == "Skip"){
         ctx.scene.state.postAJobApplicantNeeded = " ";
         await ctx.replyWithHTML(`One last thing ${ctx.from.first_name}, please enter Vacancy number.`, cancelKeyboard);
         return ctx.wizard.next(); 
        }else{
            ctx.scene.state.postAJobApplicantNeeded = ctx.message.text;
            await ctx.replyWithHTML(`One last thing ${ctx.from.first_name}, please enter Vacancy number.`, cancelKeyboard);
            return ctx.wizard.next(); 
        }        
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
        // ctx.session.postAJobCompanyNameBold = ctx.sessio5n.postAJobCompanyName.bold();
        globalState = ctx.scene.state;
        ctx.replyWithHTML(`Here is your data\n Title: ${globalState.postAJobName}\n Description: ${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.confirmPostJobKeyboard);
    } else {
        ctx.replyWithHTML(`Please enter a valid job close date!`, cancelKeyboard);
        return;
    }
})

export const jobPostConfirmHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(globalState)
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const {
        postAJobWorkingLocationId,
        postAJobApplicantNeeded,
        postAJobVancancyNumber,
        postAJobSalary,
        postAJobType,
        postAJobDescription,
        postAJobName,
        postAJobSectorId
    } = globalState
    // console.log(ctx.session.postAJobCompanyName.substring(3), "job company name")
    const { data } = await inserJobPost({
        object: {
            city_id: postAJobWorkingLocationId,
            close_date: new Date().toISOString(),
            created_by: users[0].id,
            entity_id: globalState.postAJobCompanyName? ctx.session.postAJobCompanyName.substring(3): null,
            description: postAJobDescription,
            from_platform_id: "941cc536-5cd3-44a1-8fca-5f898f26aba5",
            job_type_id: postAJobType,
            title: postAJobName,
            vacancy_number: postAJobVancancyNumber,
            sectors: {
                data: {
                    sector_id: postAJobSectorId
                }
            },
           
        }
    })
    if (data) {
        ctx.replyWithHTML(`Congradulations you have post a job successfully.`, cancelKeyboard);
    } else {
        ctx.reply("Error posting your job")
    }
    // Do the logic to register job post
    // ctx.replyWithHTML(`Congradulations you have post a job to ${ctx.session.postAJobCompanyNameBold} company successfully.`, cancelKeyboard);
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
                await ctx.reply("title Updated, you can edit more fileds here");
                await ctx.replyWithHTML(`Here is your data\n Title:${globalState.postAJobName}\n Description:${globalState.postAJobDescription}\n Job Type: ${globalState.postAJobType}\n Job Sector: ${globalState.postAJobSector}\n Job Salary: ${globalState.postAJobSalary}\n Working Location: ${globalState.postAJobWorkingLocation}\n Applicant Needed: ${globalState.postAJobApplicantNeeded}\n Vancancy: ${globalState.postAJobVancancyNumber}`, kb.editJobPostKeyboard);
                break;
            case "description":
                globalState.postAJobDescription = response
                await ctx.reply("Description Updated, you can edit more fileds here");
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

//under here employer side
export const doneJobPostPaymentSummeryHandler = async (ctx: any) => {
    ctx.deleteMessage();
   console.log(ctx.match)
   let paymentSummeryJobId = ctx.match[0].split('_')[1];
   console.log(paymentSummeryJobId);
   ctx.session.jobId = paymentSummeryJobId;
   ctx.replyWithHTML("The employer will see all employees payment summery", onlyMainMenuKeyboard)
}
export const doneJobPostProfileHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    ctx.replyWithHTML("The employer will see the profile here", onlyMainMenuKeyboard)
 }
 export const doneJobPostReviewRateHandler = async (ctx: any) => {
    console.log(ctx.match)
    ctx.replyWithHTML("The employer will give the employee based on their performance here\n\n\n\n\n\n\n\n\n..",{
        reply_markup:{
            inline_keyboard: [
                [{text: "1", callback_data:"hmm"}, {text: "2", callback_data: "hmm"},{text: "3", callback_data: "hmm"},{text: "4", callback_data: "hmm"},{text: "5", callback_data: "hmm"},]
            ]
        }
    })
 }

 export const activeJobPostDoneHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match)
    let doneJobId = ctx.match[0].split('_')[1];
    console.log(doneJobId);
    ctx.session.jobId = doneJobId;

    const { data, error } = await fetchJobById({ id: ctx.session.jobId });
    console.log(data)
    ctx.session.jobTypeName = data.jobs[0].job_type.name;
    ctx.session.jobTitle = data.jobs[0].title;
    ctx.session.jobDescription = data.jobs[0].description;
    ctx.session.jobApplicants = data.jobs[0].applications;
 
    if(ctx.session.jobApplicants.length){
        let applicantionId= data.jobs[0].applications[0].id;
        let applicantFirstName = data.jobs[0].applications[0].job_seeker.user.first_name;
        let applicantLastName = data.jobs[0].applications[0].job_seeker.user.last_name;
        let applicantTelegramId = data.jobs[0].applications[0].job_seeker.user.telegram_id;
        ctx.session.applicationId = applicantionId;
        ctx.session.applicantFirstName = applicantFirstName;
        ctx.session.applicantLastName = applicantLastName;
        ctx.session.applicantTelegramId = applicantTelegramId
        ctx.replyWithHTML(`<b>Job Title: </b> ${ctx.session.jobTitle}\n\n<b>Job Type: </b>${ctx.session.jobTypeName}\n\n<b>Job Description: </b>${ctx.session.jobDescription}`,{
            reply_markup: {
                inline_keyboard: [
                    [{text: "PAY",callback_data: "activejobpostpay_"+data.jobs[0].id}, {text: "Review and Rate", callback_data: "activejobpostreview_"+data.jobs[0].id}]
                ]
            }
        })
    }else{
        ctx.replyWithHTML("You don't have any applicants for this job", onlyMainMenuKeyboard);
    }  
 }

 export const activeJobPostProfileHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match)
    ctx.replyWithHTML("The employer will see the profile here", onlyMainMenuKeyboard)
 }

 export const activeJobPostPayHandler = async (ctx: any) => {
    ctx.deleteMessage();
     console.log(ctx.match)
    let activeJobId = ctx.match[0].split('_')[1];
    console.log(activeJobId);
    ctx.session.activeJobId = activeJobId;
    ctx.replyWithHTML(`<b>${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}</b>\n<b>*****</b>\n\n<b>Amount: </b> Amount In birr\n\n<b>job detail</b>\n\n<b>Job End Date: </b>Date`, {
        reply_markup: {
            inline_keyboard: [ 
                [{text: "PAY", callback_data: "activeJobpayforemployee_"+activeJobId}, {text: "Review and Rate", callback_data: "activejobreviewemployee_"+activeJobId}]
            ]
        }
    })   
 }
 export const activeJobPostReviewHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeJobId = ctx.match[0].split('_')[1];
    console.log(activeJobId);
    ctx.session.activeJobId = activeJobId;
    console.log(ctx.session.applicantFirstName);
    const { data, error } = await fetchRatingQuestions()
    console.log(data)
        if (data) {
            const  questions  = data.job_seeker_review_questions;
            console.log(questions);
            const questionName = questions.map((nm: any) => nm.question);
            const questionId = questions.map((nm: any) => nm.id);

    }

    ctx.scene.enter("reviewEmployeeScene");
  
 
}
 export const activeJobPostPayForEmployeeHandler = async (ctx: any) => { 
 ctx.deleteMessage();
 console.log(ctx.match);
 let activeJobId = ctx.match[0].split('_')[1];
 console.log(activeJobId);
 ctx.session.activeJobId = activeJobId;
 ctx.replyWithHTML(`please confirm by clicking yes if u want to pay, if not please click No\n\n<b>${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}</b>\n<b>*****</b>\n\n<b>Amount: Amount in birr</b>\n job detail\nproject done on ----- datae`, {
    reply_markup:{
        inline_keyboard: [
            [{text: "Yes", callback_data: "jobpostyespay_"+activeJobId}, {text: "No", callback_data: "jobpostnodontpay_"+activeJobId}]
        ]
    }
 })
 }
export const activeJobPostReviewForEmployeeHandler = async (ctx: any) => {
    console.log(ctx.match);
    let activeJobId = ctx.match[0].split('_')[1];
    console.log(activeJobId);
    ctx.session.activeJobId = activeJobId;
    ctx.scene.enter("reviewEmployeeScene");
    // ctx.replyWithHTML("The employer will give the employee based on their performance here\n\n\n\n\n\n\n\n\n..",{
    //     reply_markup:{
    //         inline_keyboard: [
    //             [{text: "1", callback_data:"hmm"}, {text: "2", callback_data: "hmm"},{text: "3", callback_data: "hmm"},{text: "4", callback_data: "hmm"},{text: "5", callback_data: "hmm"},]
    //         ]
    //     }
    // })
}
 export const activeJobPostYesPayForEmployeeHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeJobId = ctx.match[0].split('_')[1];
    console.log(activeJobId);
    ctx.session.activeJobId = activeJobId;
    ctx.replyWithHTML("You have successfully payed", onlyMainMenuKeyboard)
 }
 export const activeJobPostNoPayForEmployeeHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeJobId = ctx.match[0].split('_')[1];
    console.log(activeJobId);
    ctx.session.activeJobId = activeJobId;
    ctx.replyWithHTML("You didn't pay the the employee", onlyMainMenuKeyboard)
 }

// under this employee side
 export const activeMyJobsRequestPaymentHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeMyJobId = ctx.match[0].split('_')[1];
    console.log(activeMyJobId);
    ctx.session.activeMyJobId = activeMyJobId;
    ctx.replyWithHTML(`<b>Request Payment\n*********</b>\n\n<b>payment amount</b>\n\nplease confirm by clicking Yes if u want to send the payment request or No if u want to decline.`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Yes", callback_data: "activemyjobYesendPrequest_"+activeMyJobId}, {text: "No", callback_data: "activemyjobdontsendPrequest_"+activeMyJobId}]
            ]
        }
    })
 }
export const activeMyJobYesSendPaymentRequestHandler = async (ctx: any) =>{
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeMyJobId = ctx.match[0].split('_')[1];
    console.log(activeMyJobId);
    ctx.session.activeMyJobId = activeMyJobId;
    ctx.replyWithHTML("you have seuccsfully send your payment request", onlyMainMenuKeyboard)
}

export const activeMyJobNodontSendPaymentRequestHandler =  async (ctx: any) =>{
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeMyJobId = ctx.match[0].split('_')[1];
    console.log(activeMyJobId);
    ctx.session.activeMyJobId = activeMyJobId;
    ctx.replyWithHTML("u did't send payment request", onlyMainMenuKeyboard)
}

 export const activeMyJobsRequestReviewHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.match);
    let activeMyJobId = ctx.match[0].split('_')[1];
    console.log(activeMyJobId);
    ctx.session.activeMyJobId = activeMyJobId;
    ctx.replyWithHTML("u have sent request review for ur emplyeer", onlyMainMenuKeyboard)
 }


 


 export const reviewEmployeeInitHandler = async (ctx: any) => {
   ctx.replyWithHTML(`How you rate the skill of your employee [${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}]`, kb.ratingKeyboard);
 }
 export const reviewEmployeeQ1Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
 if (ctx.message.text) {
   ctx.scene.state.ratingSkill = ctx.message.text;
   ctx.replyWithHTML(`How you rate quality of work of your employee [${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}]`, kb.ratingKeyboard);
   return ctx.wizard.next();
 }else{
    ctx.replyWithHTML("Please enter a valid input", kb.ratingKeyboard);
    return
 }
 })
 export const reviewEmployeeQ2Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if(ctx.message.text){
        ctx.scene.state.ratingqualityOfWork = ctx.message.text;
        ctx.replyWithHTML(`How you rate Adherence to Timeline and Schedule of your employee [${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}]`, kb.ratingKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML("Please enter a valid input", kb.ratingKeyboard);
        return
    }
})
export const reviewEmployeeQ3Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if(ctx.message.text){
        ctx.scene.state.ratingAdherence = ctx.message.text;
        ctx.replyWithHTML(`How you rate Communication of your employee [${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}]`, kb.ratingKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML("Please enter a valid input", kb.ratingKeyboard);
        return
    }
})
export const reviewEmployeeQ4Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if(ctx.message.text){
        ctx.scene.state.ratingCommunication = ctx.message.text;
        ctx.replyWithHTML(`How you rate Coopration of your employee [${ctx.session.applicantFirstName} ${ctx.session.applicantLastName}]`, kb.ratingKeyboard);
        return ctx.wizard.next();
    }else{
        ctx.replyWithHTML("Please enter a valid input", kb.ratingKeyboard);
        return
    }
})
export const reviewEmployeeQ5Handler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if(ctx.message.text){ 
        ctx.scene.state.ratingCommunication = ctx.message.text;
        globalState = ctx.scene.state;
        
    }else{
        ctx.replyWithHTML("Please enter a valid input", kb.ratingKeyboard);
        return
    }
})