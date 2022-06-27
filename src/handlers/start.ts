import { getUserByTelegramId } from "../services/registration"
import { englishMainMenuKeyboard } from "../keybaords/menu_kbs"

export const startCommandHand = async (ctx: any) => {
    console.log(ctx.from.id)
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(11)
    })
    console.log(users)
    if (!users.length) {
        return ctx.scene.enter("newCustomerRegistrationScene");
    } else { 
        const [usr] = users
        let firstName = usr.first_name;
        ctx.replyWithHTML(`hi ${firstName}, please select which one of you are ?`, englishMainMenuKeyboard);
    }
}
