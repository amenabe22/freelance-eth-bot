import { applicationStateCancelBtn, confirmApplyJobKeyboard, portfolioLinksKeyboard, postAJobOptionalKeyboard } from "../../keybaords/jobpost_kbs";
import { Telegraf } from "telegraf";
import * as kb from "../../keybaords/jobpost_kbs";
import { MAX_PF_Links_LIMIT } from "../../constants"
import { ve, vp, vw, vn } from "../../utils.py/validation";
import { getUserByTelegramId } from "../../services/registration";
import { insertApplication } from "../../services/jobpost";

let globalState: any;
let totalAddedPortfolioLinks = 0;
export const jobAppInitHandler = async (ctx: any) => {
    ctx.scene.state.postId = ctx.session.postId;
    ctx.scene.state.jobPostTitle = ctx.session.jobPostTitle;
    ctx.scene.state.jobPostDescription = ctx.session.jobPostDescription;

    await ctx.replyWithHTML(`Job Title: ${ctx.scene.state.jobPostTitle}\n\nJob Description: ${ctx.scene.state.jobPostDescription}`)
    await ctx.reply("Write a message for the employer to review and why you are the right person for this job.\n\nNote: CV will be attached automatically", applicationStateCancelBtn);
}

export const jobAppNoteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.jobSeekerNote = ctx.message.text;
        ctx.reply("Please add your portfolio links like linkedin, github or other links that can show about your expriance and talents.", postAJobOptionalKeyboard)
        return ctx.wizard.next();
    } else {
        ctx.reply("please enter a valid description", applicationStateCancelBtn);
        return
    }
})
export const jobPortfolioLinksHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text === "Skip") {
            globalState = ctx.scene.state
            // console.log("globalState", globalState);
            ctx.replyWithHTML(`User Profile Load heren\n\nDescription:\n${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, confirmApplyJobKeyboard)
        } else if (ctx.message.text == "Done") {
            globalState = ctx.scene.state
            ctx.replyWithHTML(`User Profile Load heren\n\nDescription:\n${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, confirmApplyJobKeyboard)
        } else if (vw(ctx.message.text)) {
            totalAddedPortfolioLinks++
            ctx.scene.state[`jobApplyPorfolioLink${totalAddedPortfolioLinks}`] = ctx.message.text;
            globalState = ctx.scene.state
            if (totalAddedPortfolioLinks >= MAX_PF_Links_LIMIT) {
                globalState = ctx.scene.state
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, confirmApplyJobKeyboard)
            }
            ctx.replyWithHTML(`please add more portfolio links.`, portfolioLinksKeyboard);
        } else {
            ctx.replyWithHTML('please enter a valid portfolio link', postAJobOptionalKeyboard);
            return
        }
    } else {
        ctx.replyWithHTML('please enter a valid portfolio link', postAJobOptionalKeyboard);
        return
    }

})


export const jobApplyConfirmHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log("globalState", globalState);
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    console.log("jobseekerid", users[0].job_seeker.id)
    const {
        jobSeekerNote,
        postId,
        jobApplyPorfolioLink1,
        jobApplyPorfolioLink2,
        jobApplyPorfolioLink3
    } = globalState

    const { data } = await insertApplication({
        object: {
            created_at: new Date().toISOString(),
            description: jobSeekerNote,
            from_platform_id: "941cc536-5cd3-44a1-8fca-5f898f26aba5",
            job_id: postId,
            job_seeker_id: users[0].job_seeker.id,
            updated_at: new Date().toISOString(),
            application_links: {
                data: [
                    {
                        link: jobApplyPorfolioLink1 ?? ""
                    },
                    {
                        link: jobApplyPorfolioLink2 ?? ""
                    },
                    {
                        link: jobApplyPorfolioLink3 ?? ""
                    }
                ]
            }
        }
    })

    if (data) {
        ctx.replyWithHTML(`Congradulations you have apply a job successfully.`, applicationStateCancelBtn);
    } else {
        ctx.reply("Error applying job", applicationStateCancelBtn)
    }
}

export const jobApplyEditInitHandler = async (ctx: any) => {
    ctx.deleteMessage();
    ctx.replyWithHTML(`Please select which field to edit`, kb.editJobApplyKeyboard);
}

export const jobApplyingSelectedFieldEditHandler = async (ctx: any) => {
    ctx.deleteMessage();
    let editTarget = ctx.match[0].split('-')[1];
    console.log(editTarget);
    ctx.session.editTarget = editTarget;
    ctx.scene.enter("editApplyingScene", ctx.scene.state);

}

export const editApplyJobInitHandler = async (ctx: any) => {
    const target = ctx.session.editTarget
    console.log("1", target)
    switch (target) {
        case "description":
            ctx.replyWithHTML("Please enter new description.", applicationStateCancelBtn);
            return
        case "pf1":
            ctx.replyWithHTML("Please enter new portfolio link.", applicationStateCancelBtn);
            return
        case "pf2":
            ctx.replyWithHTML("Please enter new portfolio link.", applicationStateCancelBtn);
            return
        case "pf2":
            ctx.replyWithHTML("Please enter new portfolio link.", applicationStateCancelBtn);
            return
        case "done":
            ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, confirmApplyJobKeyboard)
            return
        default:
            break;
    }
}


export const editApplyJobValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    const response = ctx.message.text
    const target = ctx.session.editTarget
    if (response) {
        switch (target) {
            case "description":
                globalState.jobSeekerNote = response
                await ctx.reply("Description Updated, you can edit more fileds here");
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, kb.editJobApplyKeyboard)
                break;
            case "pf1":
                globalState.jobApplyPorfolioLink1 = response
                await ctx.reply("Portfolio link 1 updated, you can edit more fileds here")
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, kb.editJobApplyKeyboard)
                break;
            case "pf2":
                globalState.jobApplyPorfolioLink2 = response
                await ctx.reply("Portfolio link 1 updated, you can edit more fileds here")
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, kb.editJobApplyKeyboard)
                break;
            case "pf3":
                globalState.jobApplyPorfolioLink2 = response
                await ctx.reply("Portfolio link 1 updated, you can edit more fileds here")
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, kb.editJobApplyKeyboard)
                break;
            case "done":
                ctx.replyWithHTML(`User Profile Load heren\n\nDescription: ${globalState.jobSeekerNote}\n\nPortfolio link 1: ${globalState.jobApplyPorfolioLink1}\nPortfolio link 2: ${globalState.jobApplyPorfolioLink2}\nPortfolio link 3: ${globalState.jobApplyPorfolioLink3}`, confirmApplyJobKeyboard)
                break;
        }
    }
})


