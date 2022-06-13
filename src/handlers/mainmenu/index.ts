import { cancelKeyboard, jobSeekerKeyboard } from "../../keybaords/menu_kbs";
import {
    fetchEducationLevel,
    fetchEducationLevels,
    fetchWorkStatus,
    fetchWorkStatuses,
    insertJobSeeker
} from "../../services/basic";
import { Telegraf } from "telegraf"

// use this instead of enter handler
export const jobSeekerInitHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    ctx.reply(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard)
})

// availability handler
export const availablityHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentAvailablity = ctx.message.text;
        const { data, errors } = await fetchEducationLevels()
        if (!errors) {
            const { education_levels } = data;
            const educationLevelNames = education_levels.map((lvl: any) => [{ text: lvl.name }])
            ctx.reply("please choose your educational level.", {
                reply_markup: JSON.stringify({
                    keyboard: educationLevelNames
                    , resize_keyboard: true, one_time_keyboard: true,
                }),
            });
        }

        return ctx.wizard.next();
    } else {
        ctx.reply(ctx.chat.id, "Please enter a valid availablity status!", cancelKeyboard);
        return;
    }
})

export const educationalLevelHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentEducationLevel = ctx.message.text;
        const { data, errors } = await fetchEducationLevel({ name: ctx.scene.state.currentEducationLevel })
        const workStatuses = await fetchWorkStatuses()
        if (!errors) {
            const { education_levels } = data
            const [{ education_lvl: id }] = education_levels
            ctx.session.currentEducationLevel = id;

        }
        const { work_statuses } = workStatuses.data
        const workStasusNames = work_statuses.map((stat: any) => [{ text: stat.name }])
        ctx.reply("please enter your work status.", {
            reply_markup: JSON.stringify({
                keyboard: workStasusNames,
                resize_keyboard: true,
                one_time_keyboard: true,
            }),
        });

        return ctx.wizard.next();
    } else {
        ctx.reply("Please enter a valid educational level!", cancelKeyboard);
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
            const [{ work_stat: { id } }] = work_statuses
            ctx.session.currentWorkStatus = id;
            await insertJobSeeker({
                obj: {
                    user_id: JSON.stringify(ctx.session.userIdd),
                    education_level_id: JSON.stringify(ctx.session.currentEducationLevel),
                    work_status_id: JSON.stringify(ctx.session.currentWorkStatus)
                }
            })
            ctx.reply("You have successfully Registerd As Job seeker", jobSeekerKeyboard);
            ctx.scene.leave();
        }
    } else {
        ctx.reply("Please enter a valid work status!", cancelKeyboard);
        return;
    }
})
