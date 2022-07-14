import { getUserByTelegramId } from "../../services/registration";
import { fetchApplication, inserShortList } from "../../services/jobpost";

export const jobApplicationHireActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.reply("Applicant has been hired")
}
export const jobApplicationShortlistActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const { data } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    let appId = ctx.match[0].split("_").slice(-1);
    const { data: { applications } } = await fetchApplication({
        id: appId[0]
    })
    const [{ job_seeker }] = applications
    await inserShortList({
        "object": {
            "application_id": appId[0],
            "description": "",
            "created_by": data.users[0].id
        }
    }).then(() => {
        const str = `
        <b>${job_seeker.user.first_name} ${job_seeker.user.last_name}</b>  
    
    Hired by 6 Employers 
    Completed 8 Jobs total
    Shortlisted by 20 employers  
    __________________
    
    First Name: ${job_seeker.user.first_name}
    
    Last Name: ${job_seeker.user.last_name}
    
    Date of Birth:  ${job_seeker.user.date_of_birth}
    
    Gender: ${job_seeker.user.gender}
    
    Resident City: ${job_seeker.user.city.name} 
    
    Phone number: ${job_seeker.user.phone}
    
    Email: ${job_seeker.user.email}
    
    Current work/employment Status: ${job_seeker.education_level.name} 
    
    Current Education level: ${job_seeker.education_level.name}`
        ctx.replyWithHTML(str, {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Hire", callback_data: `app_hire_${appId[0]}`
                        }, {
                            text: "Reject", callback_data: `app_reject_${appId[0]}`
                        }
                    ],
                    [
                        {
                            text: "See Reviews", callback_data: `app_reviews_${appId[0]}`
                        }
                    ]
                ]
            }),
        })

        ctx.reply("Applicant has been shortlisted")

    }).catch(e => {
        console.log(e)
        ctx.reply("Error shortlisting Applicant")
    })
}
export const jobApplicationRejectActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply("Application has been rejected")
}
export const jobApplicationReviewsActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply("Candidate Reviews")
}
export const jobApplicationPreviewActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    let appId = ctx.match[0].split("_").slice(-1);
    const { data: { applications } } = await fetchApplication({
        id: appId[0]
    })
    const [{ job_seeker }] = applications
    console.log("app: ", appId[0], job_seeker)

    // TODO: format applicant info and attach buttons
    const str = `
    <b>${job_seeker.user.first_name} ${job_seeker.user.last_name}</b>  
⭐️⭐️⭐️⭐️ (4/5)

Hired by 6 Employers 
Completed 8 Jobs total
Shortlisted by 20 employers  
__________________

First Name: ${job_seeker.user.first_name}

Last Name: ${job_seeker.user.last_name}

Date of Birth:  ${job_seeker.user.date_of_birth}

Gender: ${job_seeker.user.gender}

Resident City: ${job_seeker.user.city.name} 

Phone number: ${job_seeker.user.phone}

Email: ${job_seeker.user.email}

Current work/employment Status: ${job_seeker.education_level.name} 

Current Education level: ${job_seeker.education_level.name}`
    ctx.replyWithHTML(str, {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {
                        text: "Shortlist", callback_data: `app_short_${appId[0]}`
                    }, {
                        text: "Reject", callback_data: `app_reject_${appId[0]}`
                    }
                ],
                [
                    {
                        text: "See Reviews", callback_data: `app_reviews_${appId[0]}`
                    }
                ]
            ]
        }),
    })
}

