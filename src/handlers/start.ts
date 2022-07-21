import { getUserByTelegramId } from "../services/registration"
import { englishMainMenuKeyboard } from "../keybaords/menu_kbs"
import { fetchJob } from "../services/jobpost"

export const startCommandHand = async (ctx: any) => {
    // console.log(ctx.i18n, "startCommand")
    console.log("******\n\n", ctx.from.id, "\n\n******")
    const startcmd = ctx.message.text.split(" ")
    const withmsg = startcmd.length > 1

    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id),
    })
    if (!users.length) {
        return ctx.scene.enter("newCustomerRegistrationScene");
    } else {
        const [{ language }] = users
        // console.log(language, "Lingo")
        ctx.i18n.locale(language)

        // have some condition to validate the job post
        let jobpostvalid = null
        if (withmsg) {
            await fetchJob({ id: startcmd[1] }).then(({ data: { jobs } }) => {
                if (jobs.length) {
                    jobpostvalid = jobs[0]
                    ctx.session.jobPostTitle = jobpostvalid.title;
                    ctx.session.jobPostDescription = jobpostvalid.description;
                }
            }).catch((e: any) => {
                console.log("error fetching job")
            })
        }

        // console.log("POST: ", jobpostvalid)
        if (jobpostvalid) {
            ctx.session.postId = startcmd[1]
            console.log("title", ctx.session.jobPostTitle);
            console.log("des", ctx.session.jobPostDescription);
            return ctx.scene.enter("jobApplicationScene")
        } else {
            const [usr] = users
            let firstName = usr.first_name;
            // console.log(ctx.i18n.t('jobseekerBtnLabel'))
            const greeting = ctx.i18n.t('greeting', {
                firstName
            })
            ctx.replyWithHTML(greeting, englishMainMenuKeyboard(ctx));
        }
    }
}
