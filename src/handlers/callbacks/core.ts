import { fetchSectors, updateLanguage } from "../../services/basic";
import { employerKeyboard, englishMainMenuKeyboard, jobSeekerKeyboard, onlyMainMenuKeyboard, chooseCompanyStartupKeyboard, choosePersonalizationOptionsupKeyboard } from "../../keybaords/menu_kbs";
import { fetchJobTypes, getUserByTelegramId, getUserByTelegramIdStartup } from "../../services/registration";
import {
    changeToAmharicKeyboard,
    editDetailProfileInlineKeyboard,
    editProfileKeybaord, settingKeyboard
} from "../../keybaords/settings";
import { companyKeyboard, starupStatusKeyboard, LicensedStartupKeyboard } from "../../keybaords/company.registration_kbs";
import { getJobSeekerSectors, getJobSeekerTypes } from "../../services/personalization";
import { myJobsKeboard } from "../../keybaords/myJobs_kbs";
import { myJobPostsKeyboard } from "../../keybaords/jobpost_kbs"
import { fetchAllPostedJobs, seekerApplications } from "../../services/jobpost";
 
export const companyStartupHandler = async (ctx: any) => {
    ctx.replyWithHTML(ctx.i18n.t('companyStartupMsg'), chooseCompanyStartupKeyboard(ctx));
}
export const companyHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })  
    if (data) {
        console.log(data);
        let checkUserEntity = data.users[0].user_entities;
        console.log(checkUserEntity)
        let myCompanies = checkUserEntity.filter((company: any) => {
            if (company.entity["verified_at"] != null) {
                return true; 
            } 
        });
        console.log("is verified", myCompanies)
        if (checkUserEntity) {
            ctx.session.userEName = myCompanies.map((nam: any) => {
                return `${nam.entity["name"]}`
            })
            console.log(ctx.session.userEName)
            ctx.session.userEId = myCompanies.map((nam: any) => {
                return `${nam.entity["id"]}`
            })
            console.log(ctx.session.userEId);
            await ctx.replyWithHTML(ctx.i18n.t('companyMsg'), {
                reply_markup: JSON.stringify({
                    inline_keyboard: ctx.session.userEName.map((x: string, xi: string) => ([{
                        text: x, callback_data: JSON.stringify(xi + 30)
                    }]))
                }),
            })
            await ctx.replyWithHTML('********************************************', {
                reply_markup: {
                    keyboard: [[{ text: ctx.i18n.t('addcompanyBtnLabel') }], [{ text: ctx.i18n.t('mainMenuBtnLabel')}]], resize_keyboard: true, one_time_keyboard: true
                }
            })
        } else {
            ctx.replyWithHTML(ctx.i18n.t('addCompanyMsg'), companyKeyboard(ctx))
        }
    }
}
export const addMoreCompanyHandler = async (ctx: any) => {
    ctx.replyWithHTML(ctx.i18n.t('addCompanyMsg'), companyKeyboard(ctx))
   }
export const startupHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramIdStartup({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (data) {
        console.log(data);
        let checkUserEntity = data.users[0].user_entities;
        if (checkUserEntity) {
            let myStartups = checkUserEntity.filter((startup: any) => {
                if (startup.entity["verified_at"] != null) {
                    return true;
                }
            });
            ctx.session.userEName = myStartups.map((nam: any) => {
                return `${nam.entity["name"]}`
            })
            console.log(ctx.session.userEName)
            ctx.session.userEId = myStartups.map((nam: any) => {
                return `${nam.entity["id"]}`
            })
            console.log(ctx.session.userEId);
            await ctx.replyWithHTML(`Starup you have registered\n\nplease select the startup to edit the information or update it.`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: ctx.session.userEName.map((x: string, xi: string) => ([{
                        text: x, callback_data: JSON.stringify(xi + 60)
                    }]))
                }),
            })
            await ctx.replyWithHTML('********************************************', {
                reply_markup: {
                    keyboard: [[{ text: "Add Startup" }], [{ text: "Main Menu" }]], resize_keyboard: true, one_time_keyboard: true
                }
            })
        } else {
            ctx.replyWithHTML(`Please choose your startup status.`, starupStatusKeyboard);
        }
    }
}

export const addMoreStartupHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Please choose your startup status.`, starupStatusKeyboard);
}
export const menuJobseekerSelectionHandler = async (ctx: any) => {
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (users.length) {
        const [user] = users
        if (!user.job_seeker) {
            ctx.scene.state.userId = user.id;
            ctx.session.userId = ctx.scene.state.userId
            ctx.scene.enter("registerJobSeekerScene")
        } else {
            ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard);
        }
        ctx.scene.leave();
    }
}

export const menuMainSelectorHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Hi ${ctx.from.first_name}, please select which one of you are ?`, englishMainMenuKeyboard(ctx));
}

// settings handler
export const menuSettingsSelectorHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Alright ${ctx.from.first_name}, Here is some of your profile in our platform`, settingKeyboard);
}

// language selctor
export const menuLanguageSelectorHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Awsome ${ctx.from.first_name}, Your courrent language is English, please select your language prefernce below.`, changeToAmharicKeyboard)
}

// handler for english selector
export const menuEnglishSelectorHandler = async (ctx: any) => {

    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id),
    })
    const [{ id }] = users
    await updateLanguage({ id, lang: "en" }).then(() => {
        ctx.replyWithHTML(`Hey ${ctx.from.first_name}, Your language is English.`, settingKeyboard)
        ctx.i18n.locale("en")
    }).catch(e => {
        console.log(e)
        ctx.reply("Error updating language")
    })
}

// handler for amharic selector
export const menuAmharicSelectorHandler = async (ctx: any) => {
    // switch user account to amharic on update
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

export const menuAccountSelectorHandler = async (ctx: any) => {
    const boldName = ctx.from.first_name.bold();
    const lastNameBold = ctx.from.last_name.bold();
    ctx.replyWithHTML(`${boldName} ${lastNameBold}\n*********\n\nHired n times by employers\nCompleted n Jobs total\nBudges(emojis)\nLodeded CV here`, editProfileKeybaord);
    ctx.replyWithHTML("Back to main menu", onlyMainMenuKeyboard);
}

// action
export const editProfileHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const boldName = ctx.from.first_name.bold();
    const lastNameBold = ctx.from.last_name.bold();
    ctx.replyWithHTML(`${boldName} ${lastNameBold}\n*********\n\nHired n times by employers\nCompleted n Jobs total\nBudges(emojis)\nLodeded CV here`, editDetailProfileInlineKeyboard);
    ctx.replyWithHTML("Back to main menu", onlyMainMenuKeyboard);
}

// action
export const editMultipleProfileHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    const toBeEdited = ctx.match[0];
    const toBeEditedItem = toBeEdited.split('-')[1];
    ctx.scene.state.toBeEditedItem = toBeEditedItem;
    ctx.session.toBeEditedItem = ctx.scene.state.toBeEditedItem
    ctx.scene.enter("editProfileScene")
}

// action
export const termsAndConditionsHandler = async (ctx: any) => {
    ctx.replyWithHTML("Terms and conditions will be loaded here", onlyMainMenuKeyboard);
}

const labelDuplicateJTypes = (jtypes: any, jtype: any) => {
    console.log(jtypes, "Dawg")
    const qry = jtypes.find((e: any) => e.job_type.id === jtype.id)
    const label = qry ? `✅ ${jtype.name}` : jtype.name
    return label

}

const labelDuplicateJtypesCb = (jtypes: any, jtype: any) => {
    const qry = jtypes.find((e: any) => e.job_type.id === jtype.id)
    const label = qry ? `per_jt_200_${jtype.id}_1` : `per_jt_200_${jtype.id}_0`
    return label
}

const labelDuplicateSectors = (jsectors: any, sector: any) => {
    const qry = jsectors.find((e: any) => e.sector.id === sector.id)
    const label = qry ? `✅ ${sector.name}` : sector.name
    return label
}

const labelDuplicateSectorCb = (jsectors: any, sector: any) => {
    const qry = jsectors.find((e: any) => e.sector.id === sector.id)
    const label = qry ? `per_sect_200_${sector.id}_1` : `per_sect_200_${sector.id}_0`
    return label
}
export const personalizedJobSelectionHandler = async (ctx: any) => {
    const telegram_id = JSON.stringify(ctx.from.id)
    const { data, error } = await getUserByTelegramId({ telegram_id })
    if (!error) {
        const [{ job_seeker }] = data.users
        if (!job_seeker) {
            const empty = `*Sectors*\n\n\n*Job Types*\n\n`
            ctx.replyWithMarkdownV2(empty, choosePersonalizationOptionsupKeyboard)
        } else {

            const { data: { job_seeker_job_types } } = await getJobSeekerTypes({ job_seeker_id: job_seeker.id })

            const { data: { job_seeker_sectors } } = await getJobSeekerSectors({ job_seeker_id: job_seeker.id })
            let str = ""
            let selectedTypes = ""
            if (job_seeker_sectors.length)
                for (let x = 0; x < job_seeker_sectors.length; x++) {
                    const sec = job_seeker_sectors[x];
                    const name = sec.sector.name
                    str += `\\- ${name}\n`
                }
            if (job_seeker_job_types.length)
                for (let x = 0; x < job_seeker_job_types.length; x++) {
                    const jt = job_seeker_job_types[x];
                    const name = jt.job_type.name
                    selectedTypes += `\\- ${name}\n`
                }

            const final = `*Sectors*\n\n${str}\n\n*Job Types*\n\n${selectedTypes}`
            ctx.replyWithMarkdownV2(final, choosePersonalizationOptionsupKeyboard)
        }
    }
}

export const editPersonalizationJobTypeActionHandler = async (ctx: any) => {
    const telegram_id = JSON.stringify(ctx.from.id)
    const { data, errors } = await getUserByTelegramId({ telegram_id })
    const { data: { job_types } } = await fetchJobTypes()

    if (!errors) {
        const boldTitle = "*Job Types*"
        const [{ job_seeker }] = data.users

        if (!job_seeker) {
            ctx.replyWithMarkdownV2(`${boldTitle}\n\nPick any job types you want to get notifications and personalized job posts\n\n`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: job_types.map((x: any, xi: any) => ([{
                        text: x.name,
                        callback_data: `per_jt_200_${x.id}_0`
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            });
        } else {
            const jtypes = await getJobSeekerTypes({ job_seeker_id: job_seeker.id })
            const { job_seeker_job_types } = jtypes.data
            const jobTypesBoard = job_types.map((x: any, xi: any) => ([{
                text: labelDuplicateJTypes(job_seeker_job_types, x),
                callback_data: labelDuplicateJtypesCb(job_seeker_job_types, x)
            }]))

            ctx.replyWithMarkdownV2(`${boldTitle}\n\nPick any job types you want to get notifications and personalized job posts\n\n`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: jobTypesBoard, resize_keyboard: true, one_time_keyboard: true,
                }),
            });
        }
        ctx.replyWithHTML("*****************************", onlyMainMenuKeyboard)
    }
}

export const editPersonalizationSectorsActionHandler = async (ctx: any) => {
    const telegram_id = JSON.stringify(ctx.from.id)
    const { data, errors } = await getUserByTelegramId({ telegram_id })


    if (!errors) {
        const [{ job_seeker }] = data.users
        const boldSectors = "Sectors".bold();
        const sctrs = await fetchSectors()
        const { sectors } = sctrs.data;

        if (!job_seeker) {
            ctx.replyWithHTML(`${boldSectors}\nPick three sectors you want to get notifications and personalized job posts\n\nNote: You can only select 3 Categories`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: sectors.map((x: any, xi: any) => ([{
                        text: x.text,
                        callback_data: `per_sect_200_${x.id}_0`
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            });

        } else {
            const jsectors = await getJobSeekerSectors({ job_seeker_id: job_seeker.id })
            const { job_seeker_sectors } = jsectors.data
            ctx.session.personalizedJobSeekerId = job_seeker.id;
            const jobseekersBoard = sectors.map((x: any, xi: any) => ([{
                text: labelDuplicateSectors(job_seeker_sectors, x),
                callback_data: labelDuplicateSectorCb(job_seeker_sectors, x)
            }]))
            ctx.replyWithHTML(`${boldSectors}\nPick three sectors you want to get notifications and personalized job posts\n\nNote: You can only select 3 Categories`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: jobseekersBoard, resize_keyboard: true, one_time_keyboard: true,
                }),
            });
        }
        ctx.replyWithHTML("*****************************", onlyMainMenuKeyboard)

    }
}
export const employerMenuSelectionHandler = async (ctx: any) => {
    ctx.replyWithHTML(`${ctx.from.first_name}, what do you like to do today?`, employerKeyboard(ctx));
}



export const myJobPostsOpenedJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].job_seeker.id
    const { data: { jobs } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "open"
    })
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Status: </b>${job.status}`, onlyMainMenuKeyboard);
    }

    if (!jobs.length) {
        ctx.replyWithHTML('You have no opened jobs', onlyMainMenuKeyboard);
    }
    // ctx.replyWithHTML('Opened jobs will list here.', onlyMainMenuKeyboard);
}
export const myJobPostsClosedJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].id
    const { data: { jobs } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "closed"
    })
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Job Type: </b>${job.job_type.name}\n\n<b>Status: </b>${job.status}\n\n<b>Description: </b>${job.description}`, onlyMainMenuKeyboard);
    }
    if (!jobs.length) {
        ctx.replyWithHTML('You have no closed jobs', onlyMainMenuKeyboard);
    }
}
export const myJobPostsPendingJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].id
    const { data: { jobs, id } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "pending"
    })

    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Job Type: </b>${job.job_type.name}\n\n<b>Status: </b>${job.status}\n\n<b>Description: </b>${job.description}`, onlyMainMenuKeyboard);
    }
    if (!jobs.length) {
        ctx.replyWithHTML('You have no pending jobs', onlyMainMenuKeyboard);
    }

}
export const myJobPostsDeclinedJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].id
    const { data: { jobs } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "declined"
    })

    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Job Type: </b>${job.job_type.name}\n\n<b>Status: </b>${job.status}\n\n<b>Description: </b>${job.description}`, onlyMainMenuKeyboard);
    }
    if (!jobs.length) {
        ctx.replyWithHTML('You have no declined jobs', onlyMainMenuKeyboard);
    }
}
export const myJobPostsActiveJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].id
    const { data: { jobs } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "pending"
    })
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        console.log(job)
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Job Type: </b>${job.job_type.name}\n\n<b>Status: </b>${job.status}\n\n<b>Description: </b>${job.description}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Job Done', callback_data: "activejobpostdone_" + job.id }, { text: "Profile", callback_data: "activejobpostprofile_" + job.id }]
                ]
            }
        });
    }
    if (!jobs.length) {
        ctx.replyWithHTML('You have no active jobs', onlyMainMenuKeyboard);
    }
}
export const myJobPostsDoneJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].id
    const { data: { jobs } } = await fetchAllPostedJobs({
        creator: job_seeker,
        status: "active"
    })
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        ctx.session.activeJobPostTitle = job.title
        ctx.session.activeJobPostJobType = job.job_type.name
        ctx.session.activeJobPostJobStatus = job.status
        ctx.session.activeJobPostJobDescription = job.description
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Job Type: </b>${job.job_type.name}\n\n<b>Status: </b>${job.status}\n\n<b>Description: </b>${job.description}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'PAYMENT SUMMERY', callback_data: "donejobpostpaymentsum_" + job.id }],
                    [{ text: "Profile", callback_data: "donejobpostprofile_" + job.id }, { text: "Review and Rate", callback_data: "donejobpostReviewandrate_" + job.id }]
                ]
            }
        });
    }
    if (!jobs.length) {
        ctx.replyWithHTML('You have no completed jobs', onlyMainMenuKeyboard);
    }
}






export const myJobPostsHandler = async (ctx: any) => {
    ctx.replyWithHTML('Choose one to see.', myJobPostsKeyboard);
}
export const myJobsHandler = async (ctx: any) => {
    ctx.replyWithHTML('Choose one to see.', myJobsKeboard);
}


export const myJobsDoneJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].job_seeker.id
    const { data: { applications } } = await seekerApplications({
        seeker: job_seeker,
        status: "closed"
    })

    for (let i = 0; i < applications.length; i++) {
        const app = applications[i]
        const job = app.job;
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Status: </b>${job.status}\n\nNote: ${app.description}`, onlyMainMenuKeyboard);
    }
    if (!applications.length) {
        ctx.replyWithHTML('you have no completed jobs', onlyMainMenuKeyboard);
    }
}
export const myJobsActiveJobHandler = async (ctx: any) => {
    const { data: { users }, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const job_seeker = users[0].job_seeker.id
    const { data: { applications } } = await seekerApplications({
        seeker: job_seeker,
        status: "active"
    })
    for (let i = 0; i < applications.length; i++) {
        const app = applications[i]
        const job = app.job;
        ctx.replyWithHTML(`<b>Title: </b>${job.title}\n\n<b>Status: </b>${job.status}\n\nDescription: ${app.description}`, {
            reply_markup: {
                inline_keyboard: [
                    // [{ text: "Request Payment", callback_data: "activemyjobsreqpayment_" + job.id }],
                    [{ text: "Request Review", callback_data: "acitvemyjobsreqreview_" + job.id }]
                ]
            }
        });
    }
    if (!applications.length) {
        ctx.replyWithHTML('you have no active jobs', onlyMainMenuKeyboard);
    }
}