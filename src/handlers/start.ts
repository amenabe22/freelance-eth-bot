import { getUserByTelegramId } from "../services/registration"
import { englishMainMenuKeyboard } from "../keybaords/menu_kbs"

export const startCommandHand = async (ctx: any) => {
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (!users.length) {
        console.log(ctx)
        console.log(ctx.from);
        console.log(ctx.chat);
        return ctx.scene.enter("newCustomerRegistrationScene");
    } else {
        const [usr] = users
        let firstName = usr.first_name;
        ctx.replyWithHTML(`hi ${firstName}, please select which one of you are ?`, englishMainMenuKeyboard);
    }
}
