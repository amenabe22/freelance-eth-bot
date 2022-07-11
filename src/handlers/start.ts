import { getUserByTelegramId } from "../services/registration"
import { englishMainMenuKeyboard } from "../keybaords/menu_kbs"
import { fetchJob } from "../services/jobpost"

export const startCommandHand = async (ctx: any) => {
    console.log(ctx.message.text)
    const startcmd = ctx.message.text.split(" ")
    const withmsg = startcmd.length > 1

    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id),
    })

    if (!users.length) {
        return ctx.scene.enter("newCustomerRegistrationScene");
    } else {
        // have some condition to validate the job post
        let jobpostvalid = null
        if (withmsg) {
            const { data: { jobs } } = await fetchJob({ id: startcmd[1] })
            if (jobs.length) {
                jobpostvalid = jobs[0]
            }
        }
        console.log("POST: ", jobpostvalid)
        if (jobpostvalid) {
            ctx.replyWithHTML("You are trying to apply for a job", englishMainMenuKeyboard);
        } else {
            const [usr] = users
            let firstName = usr.first_name;
            ctx.replyWithHTML(`hi ${firstName}, please select which one of you are ?`, englishMainMenuKeyboard);
        }
    }
}
