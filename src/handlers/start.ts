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
            await fetchJob({ id: startcmd[1] }).then(({ data: { jobs } }) => {
                if (jobs.length) {
                    jobpostvalid = jobs[0]
                }
            }).catch(e => {
                console.log("error fetching job")
            })
        }
        console.log("POST: ", jobpostvalid)
        if (jobpostvalid) {
            ctx.session.postId = startcmd[1]
            return ctx.scene.enter("jobApplicationScene")
        } else {
            const [usr] = users
            let firstName = usr.first_name;
            ctx.replyWithHTML(`hi ${firstName}, please select which one of you are ?`, englishMainMenuKeyboard);
        }
    }
}
