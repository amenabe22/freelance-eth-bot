import { fetchSectors } from "../../services/basic";
import { employerKeyboard, englishMainMenuKeyboard, jobSeekerKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";
import { getUserByTelegramId } from "../../services/registration";
import {
    changeToAmharicKeyboard,
    editDetailProfileInlineKeyboard,
    editProfileKeybaord, settingKeyboard
} from "../../keybaords/settings";
import { Context } from "telegraf";


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
    ctx.replyWithHTML(`Hi ${ctx.from.first_name}, please select which one of you are ?`, englishMainMenuKeyboard);
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
    ctx.replyWithHTML(`Hey ${ctx.from.first_name}, Your language is English.`, settingKeyboard)
}

// handler for amharic selector
export const menuAmharicSelectorHandler = async (ctx: any) => {
    ctx.replyWithHTML(`Sorry ${ctx.from.first_name}, Amharic language is not available right now.`, englishMainMenuKeyboard)
}

export const menuAccountSelectorHandler = async (ctx: any) => {
    const boldName = ctx.from.first_name.bold();
    const lastNameBold = ctx.from.last_name.bold();
    ctx.replyWithHTML(`${boldName} ${lastNameBold}\n*********\n\nHired n times by employers\nCompleted n Jobs total\nBudges(emojis)\nLodeded CV here`, editProfileKeybaord);
    ctx.replyWithHTML("Back to main menu", onlyMainMenuKeyboard);
}

// action
export const editProfileHandler = async (ctx: any) => {
    console.log("dawgGgggg")
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




export const personalizedJobSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })

    const sctrs = await fetchSectors()
    if (!error) {
        const [{ job_seeker: { id } }] = data.users
        ctx.session.personalizedJobSeekerId = id;

        const { sectors } = sctrs.data;
        const boldSectors = "Sectors".bold();
        ctx.replyWithHTML(`${boldSectors}\nPick three sectors you want to get notifications and personalized job posts\n\nNote: You can only select 3 Categories`, {
            reply_markup: JSON.stringify({
                inline_keyboard: sectors.map((x: any, xi: any) => ([{
                    text: x.name, callback_data: JSON.stringify(xi + 0)
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
        ctx.replyWithHTML("*****************************", onlyMainMenuKeyboard)
    }
}


export const employerMenuSelectionHandler = async (ctx: any) => {
    ctx.replyWithHTML(`${ctx.from.first_name}, what do you like to do today?`, employerKeyboard);
}

