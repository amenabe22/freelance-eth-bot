import { jobSeekerKeyboard } from "../../keybaords/menu_kbs";
import { getUserByTelegramId } from "../../services/registration";


export const menuJobseekerSelectionHandler = async (ctx: any) => {
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })

    if (users.length) {
        console.log(ctx.from.id, "payload")
        console.log(users, "da")
        const [user] = users
        if (!user.job_seeker) {
            ctx.scene.state.userId = user.id;
            ctx.session.userId = ctx.scene.state.userId
            ctx.scene.enter("registerJobSeekerScene")
        } else {
            ctx.reply(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard);
        }
        ctx.scene.leave();
    }
}


export const personalizedJobSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })
    if (!error) {
        const { users } = data
        console.log(users)
        const [{ user: { job_seeker } }] = users
        ctx.session.personalizedJobSeekerId = job_seeker.id;
    }
}