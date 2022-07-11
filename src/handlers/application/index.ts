import { applicationStateCancelBtn } from "../../keybaords/jobpost_kbs";
import { Telegraf } from "telegraf";

let globalState: any = {};

export const jobAppInitHandler = (ctx: any) => {
    console.log(ctx.session.postId, "sess")
    globalState.postId = ctx.session.postId
    ctx.reply("Write a message for the employer to review  Note: CV will be uploaded automatically", applicationStateCancelBtn)
}

export const jobAppNoteHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    console.log(globalState, "global state")
    ctx.reply("Success & Summary")
    ctx.scene.leave()
})