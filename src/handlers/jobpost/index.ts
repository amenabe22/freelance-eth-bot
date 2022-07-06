import { cancelKeyboard, employerKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";

import { Telegraf } from "telegraf";
import * as kb from "../../keybaords/jobpost_kbs";
import { getUserByTelegramId } from "../../services/registration";

export const jobPostCancelButtonHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, employerKeyboard);
    ctx.scene.leave();
}

export const jobPostStartupSelectorActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    console.log("dawg")
    const { data, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (data) {
        console.log(data);
        const checkUserEntity = data.users[0].user_entities;
        console.log(checkUserEntity)
        const myCompanies = checkUserEntity
        console.log(myCompanies, "dawg")
        // 
        // apply verified filter once finished implementing logic
        //
        // const myCompanies = checkUserEntity.filter((company: any) => {
        //     if (company.entity["verified_at"] != null) {
        //         return true;
        //     }
        // });
        if (checkUserEntity) {
            console.log(myCompanies, "Dawg")
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
        console.log(myCompanies, "dawg")
        //
        // apply verified filter once finished implementing logic
        //        
        // const myCompanies = checkUserEntity.filter((company: any) => {
        //     if (company.entity["verified_at"] != null) {
        //         return true;
        //     }
        // });
        if (checkUserEntity) {
            console.log(myCompanies, "Dawg")
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
        await ctx.replyWithHTML(`Almost done ${ctx.from.first_name}, please enter job sector.`, kb.postAJobSectorKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job type!`, kb.postAJobTypeKeyboard);
        return;
    }
})
export const postAjobSectorHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobSector = ctx.message.text;
        await ctx.replyWithHTML(`Alright please enter job salary.`, kb.postAJobOptionalKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job sector!`, kb.postAJobSectorKeyboard);
        return;
    }
})

export const postAJobSalaryHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.postAJobSalary = " ";
        } else {
            ctx.scene.state.postAJobSalary = ctx.message.text;
        }
        await ctx.replyWithHTML(`Awsome ${ctx.from.first_name}, please enter job working location.`, kb.postAJobOptionalKeyboard);
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
        } else {
            ctx.scene.state.postAJobWorkingLocation = ctx.message.text;
        }
        await ctx.replyWithHTML(`Almost done ${ctx.from.first_name}, please enter job applicant needed.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid working location!`, kb.postAJobOptionalKeyboard);
        return;
    }
})
export const postAjobApplicantNeededHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobApplicantNeeded = ctx.message.text;
        await ctx.replyWithHTML(`One last thing ${ctx.from.first_name}, please enter job close date.`, cancelKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid job applicant needed!`, kb.postAJobOptionalKeyboard);
        return;
    }
})
export const postAJobCloseDateHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.postAJobCloseDate = ctx.message.text;
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
        ctx.session.postAJobCloseDate = ctx.scene.state.postAJobCloseDate;
        console.log(ctx.session.postAJobCloseDate);
        console.log(ctx.session.postAJobCompanyName);
        ctx.session.postAJobCompanyNameBold = ctx.session.postAJobCompanyName.bold();
        ctx.replyWithHTML(`Congradulations you have post a job to ${ctx.session.postAJobCompanyNameBold} company successfully.`, cancelKeyboard);
    } else {
        ctx.replyWithHTML(`Please enter a valid job close date!`, cancelKeyboard);
        return;
    }
})

