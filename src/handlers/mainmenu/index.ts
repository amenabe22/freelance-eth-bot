import { cancelKeyboard, jobSeekerKeyboard } from "../../keybaords/menu_kbs";
import {
    fetchEducationLevel,
    fetchEducationLevels,
    fetchSectors,
    fetchWorkStatus,
    fetchWorkStatuses,
    insertJobSeeker,
} from "../../services/basic";
import { registerJobSeekerPersonalizedJob } from "../../services/personalization";

import { Telegraf } from "telegraf"

// use this instead of enter handler

// export const jobSeekerInitHandler = Telegraf.on(["text", "contact", "document", "photo"], 
export const jobSeekerInitHandler = async (ctx: any) => {
    ctx.scene.state.userId = ctx.session.userId;
    ctx.replyWithHTML("Please eneter your educational level.", cancelKeyboard)
}

// availability handler
export const educationalLevelHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentEducationLevel = ctx.message.text;
        const { data, errors } = await fetchEducationLevel({ name: ctx.scene.state.currentEducationLevel })
        const workStatuses = await fetchWorkStatuses()
        if (!errors) {
            console.log(data,"whoa")
            const { education_levels } = data
            const [{ id }] = education_levels
            ctx.session.currentEducationLevel = id;
        }
        const { work_statuses } = workStatuses.data
        const workStasusNames = work_statuses.map((stat: any) => [{ text: stat.name }])
        ctx.replyWithHTML("please enter your work status.", {
            reply_markup: JSON.stringify({
                keyboard: workStasusNames,
                resize_keyboard: true,
                one_time_keyboard: true,
            }),
        });

        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML("Please enter a valid educational level!", cancelKeyboard);
        return;
    }
})

export const workStatusHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentEmploymentStatus = ctx.message.text;
        ctx.session.currentAvailablity = ctx.scene.state.currentAvailablity;
        ctx.session.userIdd = ctx.scene.state.userId
        const { data, errors } = await fetchWorkStatus({ name: ctx.scene.state.currentEmploymentStatus })
        if (!errors) {
            const { work_statuses } = data
            const [{ id }] = work_statuses
            ctx.session.currentWorkStatus = id;
            await insertJobSeeker({
                obj: {
                    user_id: ctx.session.userIdd,
                    education_level_id: ctx.session.currentEducationLevel,
                    work_status_id: ctx.session.currentWorkStatus
                }
            })
            ctx.replyWithHTML("You have successfully Registerd As Job seeker", jobSeekerKeyboard);
            ctx.scene.leave();
        }
    } else {
        ctx.replyWithHTML("Please enter a valid work status!", cancelKeyboard);
        return;
    }
})

export const sectorSelectionActionHandler = async (ctx: any) => {
    // TODO: improve handler
    const selectedSector = ctx.match[0];
    const { data: { sectors } } = await fetchSectors()
    ctx.session.sectorNames = sectors.map((e: any) => e.name);
    ctx.session.sectorIds = sectors.map((e: any) => e.id)

    for (let x = 0; x < sectors.length; x++) {
        if (parseInt(selectedSector) === x) {
            ctx.session.selectedSectorName = ctx.session.sectorNames[x];
            ctx.session.selectedSectorId = ctx.session.sectorIds[x];
        }
    }
    console.log("asdfadf")
    const { data } = await registerJobSeekerPersonalizedJob({
        objs: [{
            job_seeker_id: ctx.session.personalizedJobSeekerId,
            sector_id: ctx.session.selectedSectorId
        }]
    })
    if (data) {
        ctx.replyWithHTML(`You have selected ${ctx.session.selectedSectorName}`);
    }
}
