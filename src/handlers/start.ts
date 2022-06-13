import { getUserByTelegramId } from "../services/registration"
import { englishMainMenuKeyboard } from "../keybaords/menu_kbs"

export const startCommandHand = async (ctx: any) => {
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    console.log("Start: ", ctx.from.id)
    console.log(ctx.scene)
    if (!users.length) {
        return ctx.scene.enter("newCustomerRegistrationScene");
    } else {
        const [usr] = users
        let firstName = usr.first_name;
        ctx.reply(`hi ${firstName}, please select which one of you are ?`, englishMainMenuKeyboard);
    }
}
