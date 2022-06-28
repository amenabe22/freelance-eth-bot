import { cancelKeyboard, englishMainMenuKeyboard } from "../../keybaords/menu_kbs";
import { confirmProfileEditKeyboard } from "../../keybaords/settings";
import { Telegraf } from "telegraf";

export const editProfileCancelHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Hi ${ctx.from.first_name}, please select which one of you are ?`, englishMainMenuKeyboard);
    ctx.scene.leave();
}

export const settingsSceneInitHandler = async (ctx: any) => {
    ctx.reply(`Alright ${ctx.from.first_name}, please enter your ${ctx.session.toBeEditedItem}`, cancelKeyboard);
}

export const confirmEditProfileHandler = async (ctx: any) => {
    ctx.deleteMessage();
    ctx.reply(`You have successfully updated your ${ctx.session.editedItem}.`, cancelKeyboard);
    ctx.scene.leave()

}

export const editProfileHandler = Telegraf.on("text", async (ctx: any) => {
    ctx.scene.state.tobeedited = ctx.message.text;
    ctx.reply(`${ctx.session.toBeEditedItem}: ${ctx.scene.state.tobeedited}`, confirmProfileEditKeyboard);
    ctx.session.editedItem = ctx.session.toBeEditedItem;
    console.log("here", ctx.session.editedItem);

}) 