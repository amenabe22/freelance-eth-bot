import { englishMainMenuKeyboard } from "../keybaords/menu_kbs";
import { getUserByTelegramId } from "../services/registration";
import { updateLanguage } from "../services/basic";

export const amharicSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id),
    })
    const [{ id }] = users
    await updateLanguage({ id, lang: "am" }).then(() => {
        ctx.replyWithHTML(`Hey ${ctx.from.first_name} Your language is Amharic now.`, englishMainMenuKeyboard(ctx))
        ctx.i18n.locale("am")
    }).catch(e => {
        console.log(e)
        ctx.reply("Error updating language")
    })
}

export const englishSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id),
    })
    const [{ id }] = users
    await updateLanguage({ id, lang: "en" }).then(() => {
        ctx.replyWithHTML(`Hey ${ctx.from.first_name} Your language is Amharic now.`, englishMainMenuKeyboard(ctx))
        ctx.i18n.locale("am")
    }).catch(e => {
        console.log(e)
        ctx.reply("Error updating language")
    })
}
