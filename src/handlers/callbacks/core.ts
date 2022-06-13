import { jobSeekerKeyboard } from "../../keybaords/menu_kbs";
import { getUserByTelegramId } from "../../services/registration";


export const menuJobseekerSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })
    if (!error) {
        const { users } = data
        console.log(users, "dawg")
        const [ user ] = users
        if (!user.job_seeker) {
            ctx.scene.state.userId = user.id;
            ctx.session.userId = ctx.scene.state.userId
            ctx.scene.enter("registerJobSeekerScene")
        } else {
            ctx.reply(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard);
        }
        ctx.reply("you haven't registered yet. please start the bot again using /start command");
        ctx.scene.leave();
    }
}
