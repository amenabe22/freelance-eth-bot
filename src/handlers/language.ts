import { englishMainMenuKeyboard } from "../keybaords/menu_kbs";
import { chooseLanguageKeyboard } from "../keybaords/language_kbs";

export const amharicSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply("The Amharic version of this bot is not done yet, please use English language for now.", chooseLanguageKeyboard);
}

export const englishSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply(`Hi ${ctx.from.first_name}, What would you like to do today?`, englishMainMenuKeyboard);
}
