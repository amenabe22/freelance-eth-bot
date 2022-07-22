import fs from "fs"
import { Telegraf, Context } from "telegraf";
import FormData from "form-data";
import { cancelKeyboard, employerKeyboard, onlyMainMenuKeyboard } from "../../keybaords/menu_kbs";
import { fetchCities, fetchCity, fetchCompanySector, fetchCompanySectors } from "../../services/basic";
import { fetchSectors, fetchSector } from "../../services/basic";
import { getUserByTelegramId, getUserByPhone, verifyEmailEntity } from "../../services/registration";
import {
    companyRegisterOptionalKeyboard,
    registerCompanyConfirmKeyboard,
    registerCompanyConfirmGMKeyboard,
    registerCompanyEditKeyboard,
    companyEditHandOverKeyboard,
    companyEditKeyboard,
    registerCompanyREditKeyboard,
    socialMediaYesNoKeyboard,
    socialMediaListCRKeyboard,
    socialMediaListCGMKeyboard
} from "../../keybaords/company.registration_kbs";
import { companyHandOver, registerCompany, companyEdit } from "../../services/company.registration";
import { formatCompanyRegistrationMsg, formatCompanyRRegistrationMsg } from "../../utils.py/formatMessage";
import path from "path";
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import { ve, vp, vw } from "../../utils.py/validation";
let globalState: any;

export const editCompanyRegistrationRCbActionHandler = async (ctx: any) => {
    const target = ctx.match[0].split(".")[1];
    ctx.scene.state.editTarget = target;
    ctx.session.editTarget = target
    ctx.session.editType = "R"
    ctx.scene.state.editType = "R";
    return ctx.scene.enter("companyRegistrationREditScene")
}
export const editCompanyRegistrationCbActionHandler = async (ctx: any) => {
    console.log("initiating edit scene")
    const target = ctx.match[0].split(".")[1];
    ctx.scene.state.editTarget = target;
    ctx.session.editTarget = target
    ctx.session.editType = "G"
    ctx.scene.state.editType = "G";
    return ctx.scene.enter("companyRegistrationEditScene")
}

export const editCompanyRegistringGMHandler = async (ctx: any) => {
    console.log("state G")
    await ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyEditKeyboard);
}
export const editCompanyRegistringHandler = async (ctx: any) => {
    console.log("state R")
    await ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyREditKeyboard);
}

export const confirmRegisterCompanyGMActionHanlder = async (ctx: any) => {
    ctx.answerCbQuery();
    const { data: { users } } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    const
        {
            companyGName,
            companyRName,
            companyGNameBold,
            companyGSectorName,
            companyGSectorID,
            companyRSectorID,
            companyGEmployeeSize,
            companyREmployeeSize,
            companyRWebsite,
            companyGWebsite,
            companyGEmail,
            companyGPhoneNumber,
            companyRPhoneNumber,

            companyCGMFacebookLink,
            companyCGMTelegramLink,
            companyCGMYouTubeLink,
            companyCGMTikTokLink,
            companyCGMTwitterLink,
            companyCGMLinkedInLink,
            companyCGMOther1Link,
            companyCGMOther2Link,
            companyCGMOther3Link,

            companyGHeadQuarterLocation,
            companyGHeadQuarterLocationId,
            companyRHeadQuarterLocationId
        } = globalState
    const [{ phone, first_name, last_name }] = users
    const formData = new FormData()
    const social_links = [
        companyCGMFacebookLink,
        companyCGMTelegramLink,
        companyCGMYouTubeLink,
        companyCGMTikTokLink,
        companyCGMTwitterLink,
        companyCGMOther1Link,
        companyCGMOther2Link,
        companyCGMOther3Link
    ]
    const payload: any = {
        name: companyGName ?? companyRName,
        phone: companyGPhoneNumber ?? companyRPhoneNumber,
        sector_id: companyGSectorID ?? companyRSectorID,
        is_user_gm: companyGName ? 'true' : 'false',
        type: 'COMPANY',
        user_first_name: first_name,
        user_last_name: last_name,
        employee_size: companyGEmployeeSize ?? companyREmployeeSize,
        website: companyGWebsite ?? companyRWebsite,
        // email: companyGEmail,
        user_phone: phone,
        facebook_link: companyCGMFacebookLink,
        telegram_link: companyCGMTelegramLink,
        youtube_link: companyCGMYouTubeLink,
        tiktok_link: companyCGMTikTokLink,
        twitter_link: companyCGMTikTokLink,
        linkedin_link: companyCGMLinkedInLink,
        other_link_one: companyCGMOther1Link,
        other_link_two: companyCGMOther2Link,
        other_link_three: companyCGMOther3Link,
        // social_links: JSON.stringify(social_links.filter(e => e != undefined)),
        telegram_id: JSON.stringify(ctx.from.id),
        head_quarter: companyGHeadQuarterLocationId ?? companyRHeadQuarterLocationId,
        origin_platform_id: '941cc536-5cd3-44a1-8fca-5f898f26aba5',
        trade_license_photo: fs.createReadStream(path.join(`files/tradeLPhoto/${ctx.from.id}.jpg`)),
        rep_id_photo: fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
        rep_letter_photo: companyGName ? null : fs.createReadStream(path.join(`files/GMIdphoto/${ctx.from.id}.jpg`)),
        'folder': 'entity',
    }
    console.log("################################################")
    console.log(payload)
    console.log("################################################")

    for (const key of Object.keys(payload)) {
        if (payload[key])
            formData.append(key, payload[key])
    }
    console.log("------------------------------------------------------------")
    console.log(payload)
    console.log("------------------------------------------------------------")
    await registerCompany(formData).then(({ data }) => {
        if (data) {
            ctx.deleteMessage();
            console.log(data, " >>>> data")
            ctx.reply("sucessfully submitted", employerKeyboard(ctx))
            ctx.scene.leave();
        } else {
            ctx.reply("failed to register company")
        }
        console.log(globalState, "cr")
    }).catch((e) => {
        console.log(JSON.stringify(e))
        ctx.reply("failed to register company please edit your info")
        const message = e.response.data
        console.error(JSON.stringify(message))
        console.log(message.graphQLErrors)
    })
}

export const confirmRegisterCompanyActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    console.log(globalState, "crr")

    ctx.reply("submitted")
}
//register company with representative starts here
export const companyRInitHandler = async (ctx: any) => {
    ctx.replyWithHTML(ctx.i18n.t('companyNameMsg'), cancelKeyboard(ctx));
}

export const companyNameRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRName = ctx.message.text;
        console.log(ctx.scene.state.companyRName);
        ctx.scene.state.companyRNameBold = ctx.scene.state.companyRName.bold();
        ctx.replyWithHTML(ctx.i18n.t('companyTLPhotoMsg'), cancelKeyboard(ctx));
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
    }
})
export const companyTradeLicensePhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        console.log(ctx.update.message.photo[0])
        const fname = `${ctx.from.id}.jpg`
        const companyTradeLicensePhoto = ctx.update.message.photo[0].file_id;
        const { downloadURL }: any = await fetchTelegramDownloadLink(companyTradeLicensePhoto)
        download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
            ctx.replyWithHTML(ctx.i18.t('companyRepIdPhotoMsg'), cancelKeyboard(ctx));
            return ctx.wizard.next();
        }).catch((e) => {
            console.log(JSON.stringify(e))
        })
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
    }
})
export const companyIdPhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    console.log(ctx.update.message.photo, "ddddd")
    if (ctx.update.message.photo) {
        const companyIdPhoto = ctx.update.message.photo[0].file_id;
        const fname = `${ctx.from.id}.jpg`
        const { downloadURL }: any = await fetchTelegramDownloadLink(companyIdPhoto)
        download(downloadURL, `files/GMIdphoto/${fname}`,).then(async () => {
            ctx.replyWithHTML(ctx.i18n.t('companyRepLetterPhotoMsg'), cancelKeyboard(ctx));
        }).catch((e) => {
            console.log(JSON.stringify(e))
        })
        return ctx.wizard.next(); 
    } else { 
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
    }
})
export const companyStampedLetterPhotoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        const companyStampedLetterPhoto = ctx.update.message.photo[0].file_id;
        const fname = `${ctx.from.id}.jpg`
        const { downloadURL }: any = await fetchTelegramDownloadLink(companyStampedLetterPhoto)
        download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
            const { data, error } = await fetchCompanySectors()
            if (data) {
                console.log(data)
                const { entity_sectors } = data;
                const snames = entity_sectors.map((nm: any) => nm.en);
                let secs = snames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{ text: "Back" }])
                ctx.session.sectorNames = snames
                ctx.replyWithHTML(ctx.i18n.t('companySectorMsg'), {
                    reply_markup: JSON.stringify({
                        keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                    }), 
                })
                return ctx.wizard.next();
            }
        })

    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
    }
})
export const companyIndustrySectorRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRSectorName = ctx.message.text;
        const { data, error } = await fetchCompanySector({ name: ctx.scene.state.companyRSectorName })
        if (data) {
            const { entity_sectors } = data
            if (!entity_sectors.length) {
                ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
                    reply_markup: JSON.stringify({
                        keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
                return;
            } else {
                let sectorId = entity_sectors[0].id;
                console.log("bpt 2", sectorId)
                ctx.session.companyRSectorID = sectorId;
                ctx.scene.state.companyRSectorID = sectorId;
                ctx.replyWithHTML(ctx.i18n.t('companyEmployeeMsg'), cancelKeyboard(ctx));
                return ctx.wizard.next();
            }
        }
    }
})
export const companyEmployeeSizeRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyREmployeeSize = ctx.message.text;
        console.log(ctx.scene.state.companyREmployeeSize);
        ctx.replyWithHTML(ctx.i18n.t('companyWebsiteMsg'), companyRegisterOptionalKeyboard(ctx));
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), cancelKeyboard(ctx));
        return;
    }
})
export const companyWebsiteRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyRWebsite = " ";
            await ctx.replyWithHTML(ctx.i18n.t('companyAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx))
            return ctx.wizard.next();
        } else if (vw(ctx.message.text)) {
            ctx.scene.state.companyRWebsite = ctx.message.text;
            await ctx.replyWithHTML(ctx.i18n.t('companyAskSocialMediaMsg'), socialMediaYesNoKeyboard(ctx))
            return ctx.wizard.next();
        } else {
            ctx.replyWithHTML(ctx.i18.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
            return;
        }
    } else {
        ctx.replyWithHTML(ctx.i18.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companySocialMediaLinkYesNoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "No") {
            await ctx.replyWithHTML(ctx.i18n.t('companyEmailMsg'), companyRegisterOptionalKeyboard(ctx));
            return ctx.wizard.next();
        } else if (ctx.message.text == "Yes") {
            ctx.replyWithHTML(ctx.i18n.t('companySocialMediaMsg'), socialMediaListCRKeyboard(ctx));
        } else {
            ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
            return;
        }
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companyEmailRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyREmail = " ";
            ctx.replyWithHTML(ctx.i18n.t('companyPhoneNoMsg'), cancelKeyboard(ctx));
            return ctx.wizard.next();
        } else if (ve(ctx.message.text)) {
            const res = await verifyEmailEntity({ email: ctx.message.text })
            console.log(res)
            if (res.data.entities.length) {
                ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
                return;
            }
            ctx.scene.state.companyREmail = ctx.message.text;
            console.log(ctx.scene.state.companyREmail);
            ctx.replyWithHTML(ctx.i18n.t('companyPhoneNoMsg'), cancelKeyboard(ctx));
            return ctx.wizard.next();
        } else {
            ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
            return;
        }
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companyOfficialPhoneNoRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (vp(ctx.message.text)) {
        ctx.scene.state.companyRPhoneNumber = ctx.message.text;
        const { data, error } = await fetchCities()
        if (data) {
            const { cities } = data;
            let cnames = cities.map((nm: any) => nm.name);
            ctx.session.cityNames = cnames
            let fkbs = cnames.map((x: string, _: string) => ([{
                text: x,
            }]))
            fkbs.push([{ text: "Back" }])
            ctx.replyWithHTML(ctx.i18n.t('companyHQMsg'), {
                reply_markup: JSON.stringify({
                    keyboard: fkbs, resize_keyboard: true, one_time_keyboard: true,
                }),
            })
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companyHeadQuarterLocationRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyRHeadQuarterLocation = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.companyRHeadQuarterLocation })
        const { cities } = data
        console.log(cities.length, "bpt 1")
        if (!cities.length) {
            ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
                reply_markup: JSON.stringify({
                    keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                        text: x,
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            })
            return;
        } else {
            let hqId = cities[0].id;
            console.log("bpt 2", hqId)
            ctx.session.companyRHeadQuarterLocationId = hqId;
            ctx.scene.state.companyRHeadQuarterLocationId = hqId;
            globalState = ctx.scene.state;
            await ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
            await ctx.replyWithHTML("****************************", onlyMainMenuKeyboard(ctx))
        }
    } else {
        ctx.replyWithHTML(ctx.i18n.t('companyStartupInvalidMsg'), {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
        return;
    }
})

// register company with representative ends.

//register company with General manager starts here.

export const companyEditInitHandler = async (ctx: any) => {
    const target = ctx.session.editTarget
    console.log(ctx.wizard, "company edit init")
    console.log("1", target)
    switch (target) {
        case "name":
            console.log("2")
            ctx.replyWithHTML(ctx.i18n.t('companyNameMsg'), cancelKeyboard(ctx));
            return

        case "sector":
            const { data, error } = await fetchSectors()
            if (data) {
                const { sectors } = data;
                let snames = sectors.map((nm: any) => nm.name);
                let secs = snames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{ text: "Back" }])
                ctx.replyWithHTML(ctx.i18n.t('companySectorMsg'), {
                    reply_markup: JSON.stringify({
                        keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        case "phone":
            ctx.replyWithHTML(ctx.i18n.t('companyPhoneNoMsg'), cancelKeyboard(ctx));
            return
        case "website":
            ctx.replyWithHTML(ctx.i18n.t('companyWebsiteMsg'), cancelKeyboard(ctx));
            return
        case "email":
            ctx.replyWithHTML(ctx.i18n.t('companyEmailMsg'), cancelKeyboard(ctx));
            return
        case "hqs":
            const res = await fetchCities()
            if (res.data) {
                const { cities } = res.data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                ctx.replyWithHTML(ctx.i18n.t('companyHQMsg'), {
                    reply_markup: JSON.stringify({
                        keyboard: cnames.map((x: string, _: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return
        default:
            break;
    }
}

export const companyEditRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    // ctx.scene.state.firstNameRegister = ctx.message.text;
    const response = ctx.message.text
    const target = ctx.session.editTarget
    console.log(response, target, "dawg RR")
    if (response) {
        // validate and update state
        switch (target) {
            case "name":
                globalState.companyRSectorName = response
                ctx.reply("Name Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                break;
            case "sector":
                globalState.companyRSectorName = response
                ctx.scene.state.companyRSectorName = response;
                const { data } = await fetchSector({ name: response })
                const { sectors } = data
                if (!sectors) {
                    ctx.replyWithHTML("please enter valid industry sector!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let sectorId = sectors[0].id;
                    ctx.session.companyRSectorID = sectorId;
                    ctx.scene.state.companyRSectorID = sectorId;
                    ctx.reply("Sector Updated")
                    ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                    break;
                }
            case "phone":
                globalState.companyRPhoneNumber = response
                ctx.reply("Phone Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                break;
            case "website":
                globalState.companyRWebsite = response
                ctx.reply("Website Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                break;
            case "email":
                globalState.companyREmail = response
                ctx.reply("Email Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                break;
            case "hqs":
                globalState.companyRHeadQuarterLocation = response
                const res = await fetchCity({ name: globalState.companyRHeadQuarterLocation })
                const { cities } = res.data
                if (!cities.length) {
                    ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let hqId = cities[0].id;
                    ctx.session.companyRHeadQuarterLocationId = hqId;
                    ctx.scene.state.companyRHeadQuarterLocationId = hqId;
                    globalState.companyRHeadQuarterLocationId = hqId
                    // globalState = ctx.scene.state;
                }
                ctx.reply("Updated HeadQuarters")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmKeyboard);
                break;
        }
    }
})
export const companyEditValueRHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    const response = ctx.message.text
    const target = ctx.session.editTarget
    console.log("Target: ", target)
    if (response) {
        // validate and update state
        switch (target) {
            case "name":
                globalState.companyGName = response
                ctx.reply("Name Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "sector":
                globalState.companyGSectorName = response
                ctx.scene.state.companyGSectorName = response;
                const { data } = await fetchSector({ name: response })
                const { sectors } = data
                console.log(data)
                if (!sectors) {
                    ctx.replyWithHTML("please enter valid industry sector!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let sectorId = sectors[0].id;
                    ctx.session.companyGSectorID = sectorId;
                    ctx.scene.state.companyGSectorID = sectorId;
                    ctx.reply("Sector Updated")
                    ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                    break;
                }
            case "phone":
                globalState.companyGPhoneNumber = response
                ctx.reply("Phone Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "website":
                globalState.companyRWebsite = response
                globalState.companyGWebsite = response
                ctx.reply("Website Updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "email":
                globalState.companyGEmail = response
                ctx.reply("updated")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "hqs":
                globalState.companyGHeadQuarterLocation = response
                const res = await fetchCity({ name: globalState.companyGHeadQuarterLocation })
                const { cities } = res.data
                console.log(cities.length, "bpt 1")
                if (!cities.length) {
                    ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let hqId = cities[0].id;
                    ctx.session.companyGHeadQuarterLocationId = hqId;
                    ctx.scene.state.companyGHeadQuarterLocationId = hqId;
                    globalState = ctx.scene.state;
                }
                ctx.reply("Updated HeadQuarters")
                ctx.replyWithHTML(formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
        }
    }
})
export const companyEditValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    const response = ctx.message.text
    const target = ctx.session.editTarget
    const isG = ctx.session.editType == "G"
    console.log(response, target, "dawg")
    if (response) {
        // validate and update state
        switch (target) {
            case "name":
                isG ? globalState.companyGName = response : globalState.companyRName = response
                ctx.reply("Name Updated")
                ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "sector":
                isG ? globalState.companyGSectorName = response : globalState.companyRSectorName = response
                isG ? ctx.scene.state.companyGSectorName = response : ctx.scene.state.companyRSectorName = response;
                const { data } = await fetchSector({ name: response })
                const { sectors } = data
                console.log(data)
                if (!sectors) {
                    ctx.replyWithHTML("please enter valid industry sector!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let sectorId = sectors[0].id;
                    isG ? ctx.session.companyGSectorID = sectorId : ctx.session.companyRSectorID = sectorId;
                    isG ? ctx.scene.state.companyGSectorID = sectorId : ctx.scene.state.companyRSectorID = sectorId;
                    ctx.reply("Sector Updated")
                    ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                    break;
                }
            case "phone":
                isG ? globalState.companyGPhoneNumber = response : globalState.companyGPhoneNumber = response
                ctx.reply("Phone Updated")
                ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "website":
                isG ? globalState.companyGWebsite = response : globalState.companyRWebsite
                ctx.reply("Website Updated")
                ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "email":
                isG ? globalState.companyGEmail = response : globalState.companyREmail = response
                ctx.reply("updated")
                ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
            case "hqs":
                isG ? globalState.companyGHeadQuarterLocation = response : globalState.companyGHeadQuarterLocation = response
                // console.log(globalState.companyGHeadQuarterLocation, "<====>", globalState.companyRHeadQuarterLocation)
                console.log(globalState.companyGHeadQuarterLocation ?? globalState.companyRHeadQuarterLocation, "1")
                const res = await fetchCity({
                    name: globalState.companyGHeadQuarterLocation ?? globalState.companyRHeadQuarterLocation
                })
                console.log(res, "2")
                const { cities } = res.data
                console.log(cities.length, "bpt 1")
                if (!cities.length) {
                    ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
                        reply_markup: JSON.stringify({
                            keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                                text: x,
                            }])), resize_keyboard: true, one_time_keyboard: true,
                        }),
                    })
                    return;
                } else {
                    let hqId = cities[0].id;
                    isG ? ctx.session.companyGHeadQuarterLocationId = hqId : ctx.session.companyRHeadQuarterLocationId = hqId;
                }
                ctx.reply("Updated HeadQuarters")
                ctx.replyWithHTML(isG ? formatCompanyRegistrationMsg(globalState) : formatCompanyRRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
                break;
        }
    }
})

export const socialMediaAddingActionCRHandler = async (ctx: any) => {
    ctx.deleteMessage();
    let clicked = ctx.match[0];
    ctx.session.targetedText = clicked.split('-')[0];
    console.log(ctx.session.targetedText);
    ctx.scene.enter("socialMediaLinkCRScene", ctx.scene.state)
}

export const companySocialMediaLinkCRInitHandler = async (ctx: any) => {
    if (ctx.session.targetedText == "facebook") {
        ctx.replyWithHTML("please enter facebook link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "telegram") {
        ctx.replyWithHTML("please enter telegram link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "youtube") {
        ctx.replyWithHTML("please enter youtube link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "tiktok") {
        ctx.replyWithHTML("please enter tiktok link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "twitter") {
        ctx.replyWithHTML("please enter twitter link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "linkedin") {
        ctx.replyWithHTML("please enter linkedin link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "otherlink1") {
        ctx.replyWithHTML("please enter otherlink1 link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "otherlink2") {
        ctx.replyWithHTML("please enter otherlink2 link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "otherlink3") {
        ctx.replyWithHTML("please enter otherlink3 link of your company", cancelKeyboard);
    } else if (ctx.session.targetedText == "done") {
        ctx.scene.enter("socialMediaLinkDoneCRScene", ctx.scene.state);
    }

}

export const companySocialMediaLinkCRValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.session.targetedText == "facebook") {
        ctx.scene.state.companyCRFacebookLink = ctx.message.text;
        ctx.replyWithHTML(" you have added facebook link.\n\nyou can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "telegram") {
        ctx.scene.state.companyCRTelegramLink = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "youtube") {
        ctx.scene.state.companyCRYouTubeLink = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "tiktok") {
        ctx.scene.state.companyCRTikTokLink = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "twitter") {
        ctx.scene.state.companyCRTwitterLink = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "linkedin") {
        ctx.scene.state.companyCRLinkedInLink = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink1") {
        ctx.scene.state.companyCROther1Link = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink2") {
        ctx.scene.state.companyCROther2Link = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink3") {
        ctx.scene.state.companyCROther3Link = ctx.message.text;
        ctx.replyWithHTML("u can add other social media links or click done and go to next step", socialMediaListCRKeyboard(ctx));
    } else if (ctx.session.targetedText == "done") {
        ctx.scene.enter("socialMediaLinkDoneCRScene", ctx.scene.state);
    }
})
export const companySocialMediaLinkDoneCRInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter email of your company.", companyRegisterOptionalKeyboard)
}

























export const companyGInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter the name of your comapny", cancelKeyboard(ctx));
}
export const companyNameGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGName = ctx.message.text;
        console.log(ctx.scene.state.companyGName);
        ctx.scene.state.companyGNameBold = ctx.scene.state.companyGName.bold();
        ctx.replyWithHTML(`please send the photo of company trade license scanned photo.`, cancelKeyboard(ctx));
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter a valid name!`, cancelKeyboard(ctx));
        return;
    }
})
export const companyTradeLicensePhotoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        console.log(ctx.update.message.photo[0])
        const companyTradeLicensePhoto = ctx.update.message.photo[0].file_id;
        const fname = `${ctx.from.id}.jpg`
        const { downloadURL }: any = await fetchTelegramDownloadLink(companyTradeLicensePhoto)
        download(downloadURL, `files/tradeLPhoto/${fname}`,).then(async () => {
            ctx.replyWithHTML(`please enter General Manager id photo.`, cancelKeyboard(ctx));
            // return ctx.wizard.next();
        })
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter avalid trade license photo!`, cancelKeyboard(ctx));
        return;
    }
})
export const companyIdPhotoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.update.message.photo) {
        const companyIdPhoto = ctx.update.message.photo[0].file_id;
        const fname = `${ctx.from.id}.jpg`
        const { downloadURL }: any = await fetchTelegramDownloadLink(companyIdPhoto)
        download(downloadURL, `files/GMIdphoto/${fname}`,).then(async () => {
            const { data, error } = await fetchSectors()
            if (data) {
                const { sectors } = data;
                let snames = sectors.map((nm: any) => nm.name);
                ctx.session.sectorNames = snames
                let secs = snames.map((x: string, _: string) => ([{
                    text: x,
                }]))
                secs.push([{ text: "Back" }])

                ctx.replyWithHTML("please enter industry sector.", {
                    reply_markup: JSON.stringify({
                        keyboard: secs, resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return ctx.wizard.next();
        })
    } else {
        ctx.replyWithHTML(`Please enter avalid id photo!`, cancelKeyboard(ctx));
        return;
    }
})

export const companyIndustrySectorGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        console.log(ctx.scene.state.companyGSectorName, "sector name")
        ctx.scene.state.companyGSectorName = ctx.message.text;
        const { data, error } = await fetchSector({ name: ctx.scene.state.companyGSectorName })
        const { sectors } = data
        console.log(data)
        if (!sectors) {
            ctx.replyWithHTML("please enter valid industry sector!", {
                reply_markup: JSON.stringify({
                    keyboard: ctx.session.sectorNames.map((x: string, xi: string) => ([{
                        text: x,
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            })
            return;
        } else {
            let sectorId = sectors[0].id;
            console.log("bpt 2", sectorId)
            ctx.session.companyGSectorID = sectorId;
            ctx.scene.state.companyGSectorID = sectorId;
            ctx.replyWithHTML("please enter employee size of your company.", cancelKeyboard(ctx));
            return ctx.wizard.next();
        }
    }
})
export const companyEmployeeSizeGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGEmployeeSize = ctx.message.text;
        console.log(ctx.scene.state.companyGEmployeeSize);
        ctx.replyWithHTML(`please enter website of your company.`, companyRegisterOptionalKeyboard(ctx));
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid employee size of your company!`, companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companyWebsiteGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyGWebsite = " ";
            await ctx.replyWithHTML(`Do you want to add social media links for your company ?`, socialMediaYesNoKeyboard(ctx));
        } else if (vw(ctx.message.text)) {
            ctx.scene.state.companyGWebsite = ctx.message.text;
            await ctx.replyWithHTML(`Do you want to add social media links for your company ?`, socialMediaYesNoKeyboard(ctx));
        } else {
            ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard(ctx));
            return;
        }

        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`please enter valid company website!`, companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companySocialMediaLinkYesNoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "No") {
            await ctx.replyWithHTML(`please enter your company Email`, companyRegisterOptionalKeyboard(ctx));
            return ctx.wizard.next();
        } else if (ctx.message.text == "Yes") {
            ctx.replyWithHTML(`please choose which social media link to enter.`, socialMediaListCGMKeyboard);
        } else {
            ctx.replyWithHTML(`sorry I don't understand!`, socialMediaYesNoKeyboard(ctx));
            return;
        }
    } else {
        ctx.replyWithHTML(`sorry I don't understand!`, socialMediaYesNoKeyboard(ctx));
        return;
    }
})
export const companyEmailGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.message.text == "Skip") {
            ctx.scene.state.companyGEmail = " ";
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard(ctx));
            return ctx.wizard.next();
        } else if (ve(ctx.message.text)) {
            const res = await verifyEmailEntity({ email: ctx.message.text })
            if (res.data.entities.length) {
                ctx.reply("Sorry email is already taken !")
                return;
            }
            ctx.scene.state.companyGEmail = ctx.message.text;
            console.log(ctx.scene.state.companyGEmail);
            ctx.replyWithHTML(`please enter your company official phone number.`, cancelKeyboard(ctx));
            return ctx.wizard.next();
        } else {
            ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard(ctx));
            return;
        }
    } else {
        ctx.replyWithHTML(`please enter valid email address of your company!`, companyRegisterOptionalKeyboard(ctx));
        return;
    }
})
export const companyOfficialPhoneNoGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (vp(ctx.message.text)) {
        ctx.scene.state.companyGPhoneNumber = ctx.message.text;
        const { data, error } = await fetchCities()
        if (data) {
            const { cities } = data;
            let cnames = cities.map((nm: any) => nm.name);
            ctx.session.cityNames = cnames
            let fkbs = cnames.map((x: string, _: string) => ([{
                text: x,
            }]))
            fkbs.push([{ text: "Back" }])

            ctx.replyWithHTML("please enter location of your company head quarter.", {
                reply_markup: JSON.stringify({
                    keyboard: fkbs, resize_keyboard: true, one_time_keyboard: true,
                }),
            })
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML(`Please enter valid official phone number of your company!`, cancelKeyboard(ctx));
        return;
    }
})
export const companyHeadQuarterLocationGHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.companyGHeadQuarterLocation = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.companyGHeadQuarterLocation })
        const { cities } = data
        console.log(cities.length, "bpt 1")
        if (!cities.length) {
            ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
                reply_markup: JSON.stringify({
                    keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                        text: x,
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            })
            return;
        } else {
            let hqId = cities[0].id;
            ctx.session.companyGHeadQuarterLocationId = hqId;
            ctx.scene.state.companyGHeadQuarterLocationId = hqId;
            globalState = ctx.scene.state;
            console.log(ctx.scene.state, "Socials")
            await ctx.replyWithHTML(formatCompanyRegistrationMsg(globalState), registerCompanyConfirmGMKeyboard);
            // await ctx.replyWithHTML(`${globalState.companyGNameBold}\n . Name: ${globalState.companyGName}\n . Sectory: ${globalState.companyGSectorName}\n . Phone: ${globalState.companyGPhoneNumber}\n . Website: ${globalState.companyGWebsite}\n . Email: ${globalState.companyGEmail}\n . Employee size: ${globalState.companyGEmployeeSize}\n . HQ Location: ${globalState.companyGHeadQuarterLocation}\n\n\n\n\n\n...`, registerCompanyConfirmGMKeyboard);
            //DO REST API CALL TO REGISTER THE COMPANY

        }
    } else {
        ctx.replyWithHTML(`please enter valid location of your company HQ!`, {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
        return;
    }
})



export const socialMediaAddingActionCGMHandler = async (ctx: any) => {
    ctx.deleteMessage();
    let clicked = ctx.match[0];
    ctx.session.targetedText = clicked.split('-')[0];
    console.log(ctx.session.targetedText);
    ctx.scene.enter("socialMediaLinkCGMScene", ctx.scene.state)
}

export const companySocialMediaLinkCGMInitHandler = async (ctx: any) => {
    if (ctx.session.targetedText == "facebook") {
        ctx.replyWithHTML("please enter facebook link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "telegram") {
        ctx.replyWithHTML("please enter telegram link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "youtube") {
        ctx.replyWithHTML("please enter youtube link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "tiktok") {
        ctx.replyWithHTML("please enter tiktok link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "twitter") {
        ctx.replyWithHTML("please enter twitter link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "linkedin") {
        ctx.replyWithHTML("please enter linkedin link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink1") {
        ctx.replyWithHTML("please enter otherlink1 link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink2") {
        ctx.replyWithHTML("please enter otherlink2 link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "otherlink3") {
        ctx.replyWithHTML("please enter otherlink3 link of your company", cancelKeyboard(ctx));
    } else if (ctx.session.targetedText == "done") {
        ctx.scene.enter("socialMediaLinkDoneCGMScene", ctx.scene.state);
    }

}

export const companySocialMediaLinkCGMValueHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    ctx.scene.state.social = []
    if (ctx.session.targetedText == "facebook") {
        ctx.scene.state.companyCGMFacebookLink = ctx.message.text;
        ctx.replyWithHTML("you have added facebook link.\n\nyou can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "telegram") {
        ctx.scene.state.companyCGMTelegramLink = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "youtube") {
        ctx.scene.state.companyCGMYouTubeLink = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "tiktok") {
        ctx.scene.state.companyCGMTikTokLink = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "twitter") {
        ctx.scene.state.companyCGMTwitterLink = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "linkedin") {
        ctx.scene.state.companyCGMLinkedInLink = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "otherlink1") {
        ctx.scene.state.companyCGMOther1Link = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "otherlink2") {
        ctx.scene.state.companyCGMOther2Link = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "otherlink3") {
        ctx.scene.state.companyCGMOther3Link = ctx.message.text;
        ctx.replyWithHTML("you can add other social media links or click done and go to next step", socialMediaListCGMKeyboard);
    } else if (ctx.session.targetedText == "done") {
        ctx.scene.enter("socialMediaLinkDoneCGMScene", ctx.scene.state);
    }
})
export const companySocialMediaLinkDoneCGMInitHandler = async (ctx: any) => {
    ctx.replyWithHTML("please enter email of your company.", companyRegisterOptionalKeyboard)
}





//register company with General manager ends here.












export const companySelectionActionHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log("here")
    const selectedCompany = ctx.match[0];
    console.log(selectedCompany);
    const { data, error } = await getUserByTelegramId({
        telegram_id: JSON.stringify(ctx.from.id)
    })
    if (data) {
        let userId = data.users[0].id;
        console.log(userId);
        ctx.session.sourceCompanyUserId = userId;
        console.log(ctx.session.sourceCompanyUserId, "hm");
        let checkUserEntity = data.users[0].user_entities;
        if (checkUserEntity) {
            let myCompanies = checkUserEntity.filter((account: any) => {
                if (account.entity["verified_at"] != null) {
                    return true;
                }
            });
            ctx.session.userCName = myCompanies.map((nam: any) => (nam.entity["name"]))
            console.log(ctx.session.userCName)
            ctx.session.userCId = myCompanies.map((nam: any) => nam.entity["id"])
            console.log(ctx.session.userCId);
            if (selectedCompany == 30) {
                ctx.session.selectedCompanyName = ctx.session.userCName[0];
                ctx.session.selectedCompanyId = ctx.session.userCId[0];
            } else if (selectedCompany == 31) {
                ctx.session.selectedCompanyName = ctx.session.userCName[1];
                ctx.session.selectedCompanyId = ctx.session.userCId[1];
            } else if (selectedCompany == 32) {
                ctx.session.selectedCompanyName = ctx.session.userCName[2];
                ctx.session.selectedCompanyId = ctx.session.userCId[2];
            }
            else if (selectedCompany == 33) {
                ctx.session.selectedCompanyName = ctx.session.userCName[3];
                ctx.session.selectedCompanyId = ctx.session.userCId[3];
            }
            else if (selectedCompany == 34) {
                ctx.session.selectedCompanyName = ctx.session.userCName[4];
                ctx.session.selectedCompanyId = ctx.session.userCId[4];
            }
            else if (selectedCompany == 35) {
                ctx.session.selectedCompanyName = ctx.session.userCName[5];
                ctx.session.selectedCompanyId = ctx.session.userCId[5];
            }
            else if (selectedCompany == 36) {
                ctx.session.selectedCompanyName = ctx.session.userCName[6];
                ctx.session.selectedCompanyId = ctx.session.userCId[6];
            }
            else if (selectedCompany == 37) {
                ctx.session.selectedCompanyName = ctx.session.userCName[7];
                ctx.session.selectedCompanyId = ctx.session.userCId[7];
            }
            else if (selectedCompany == 38) {
                ctx.session.selectedCompanyName = ctx.session.userCName[8];
                ctx.session.selectedCompanyId = ctx.session.userCId[8];
            }
            else if (selectedCompany == 39) {
                ctx.session.selectedCompanyName = ctx.session.userCName[9];
                ctx.session.selectedCompanyId = ctx.session.userCId[9];
            }
            else if (selectedCompany == 40) {
                ctx.session.selectedCompanyName = ctx.session.userCName[10];
                ctx.session.selectedCompanyId = ctx.session.userCId[10];
            }
            else if (selectedCompany == 41) {
                ctx.session.selectedCompanyName = ctx.session.userCName[11];
                ctx.session.selectedCompanyId = ctx.session.userCId[11];
            }
            console.log(ctx.session.selectedCompanyName);
            console.log(ctx.session.selectedCompanyId);
            const companyNameBold = ctx.session.selectedCompanyName.bold();
            await ctx.replyWithHTML(`${companyNameBold}\n******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, companyEditHandOverKeyboard)
            await ctx.replyWithHTML("*************************************", {
                reply_markup: {
                    keyboard: [[{ text: "Main Menu" }],], resize_keyboard: true, one_time_keyboard: true
                }
            })
        }
    }
}

export const companyEditHandler = async (ctx: any) => {
    ctx.deleteMessage();
    const companyNameBold = ctx.session.selectedCompanyName.bold();
    await ctx.replyWithHTML(`${companyNameBold}\n******************\n\nYou have hired 0 candidates\nposted total of 0 jobs\nbadge(emogis)`, companyEditKeyboard);
}

export const comanyEditFieldHandler = async (ctx: any) => {
    ctx.session.tobeEditedCompanyField = ctx.match[0];
    console.log(ctx.session.selectedCompanyId, "this is company id");
    const { data, error } = await fetchCities()
    if (data) {
        const { cities } = data;
        let cnames = cities.map((nm: any) => nm.name);
        ctx.session.cityNames = cnames;
    }
    ctx.scene.enter("companyEditSpecificFieldScene")
}

export const companyEditSpecificFieldInitHandler = async (ctx: any) => {
    ctx.deleteMessage();
    console.log(ctx.session.tobeEditedCompanyField)
    if (ctx.session.tobeEditedCompanyField == "edit_name_of_company") {
        ctx.replyWithHTML("please enter the new name of your company", cancelKeyboard(ctx));
    } else if (ctx.session.tobeEditedCompanyField == "edit_employee_of_company") {
        ctx.replyWithHTML("please enter the new employee size of your company", cancelKeyboard(ctx));
    } else if (ctx.session.tobeEditedCompanyField == "edit_email_of_company") {
        ctx.replyWithHTML("please enter the new email of your company", cancelKeyboard(ctx));
    } else if (ctx.session.tobeEditedCompanyField == "edit_phone_of_company") {
        ctx.replyWithHTML("please enter the new phone no of your company", cancelKeyboard(ctx));
    } else if (ctx.session.tobeEditedCompanyField == "edit_location_of_company") {
        ctx.replyWithHTML("please enter the new location of your company", {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: string, _: string) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        });
    } else if (ctx.session.tobeEditedCompanyField == "edit_websit_of_company") {
        ctx.replyWithHTML("please enter the new website of your company", cancelKeyboard(ctx));
    }
}
export const companyEditSpecificFieldInputHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.session.tobeEditedCompanyField == "edit_name_of_company") {
            ctx.scene.state.toBeEditedCompanyNameField = ctx.message.text;
            console.log(ctx.session.selectedCompanyId)
            const { data, errors } = await companyEdit({
                id: ctx.session.selectedCompanyId,
                set: {
                    name: ctx.scene.state.toBeEditedCompanyNameField
                }
            })
            if (errors) {
                console.log(errors);
            } else {
                console.log(data);
                ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
            }

        } else if (ctx.session.tobeEditedCompanyField == "edit_employee_of_company") {
            ctx.scene.state.tobeEditedCompanyEmployeeSizeField = ctx.message.text;
            const { data, errors } = await companyEdit({
                "id": ctx.session.selectedCompanyId,
                "set": {
                    "employee_size": ctx.scene.state.tobeEditedCompanyEmployeeSizeField
                }

            })
            if (errors) {
                console.log(errors);
            } else {
                console.log(data);
                ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
            }
        }
        else if (ctx.session.tobeEditedCompanyField == "edit_email_of_company") {
            ctx.scene.state.tobeEditedCompanyEmailField = ctx.message.text;
            const { data, errors } = await companyEdit({
                "id": ctx.session.selectedCompanyId,
                "set": {
                    "email": ctx.scene.state.tobeEditedCompanyEmailField
                }

            })
            if (errors) {
                console.log(errors);
            } else {
                console.log(data);
                ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
            }
        }

        else if (ctx.session.tobeEditedCompanyField == "edit_phone_of_company") {
            ctx.scene.state.tobeEditedCompanyPhoneField = ctx.message.text;
            const { data, errors } = await companyEdit({
                "id": ctx.session.selectedCompanyId,
                "set": {
                    "phone": ctx.scene.state.tobeEditedCompanyPhoneField
                }

            })
            if (errors) {
                console.log(errors);
            } else {
                console.log(data);
                ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
            }
        } else if (ctx.session.tobeEditedCompanyField == "edit_location_of_company") {
            ctx.scene.state.tobeEditedCompanyLocationField = ctx.message.text;
            const { data, error } = await fetchCity({ name: ctx.scene.state.tobeEditedCompanyLocationField })
            const { cities } = data
            console.log(cities.length, "bpt 1")
            if (!cities.length) {
                ctx.replyWithHTML("Please enter a valid location of your company head quarter!", {
                    reply_markup: JSON.stringify({
                        keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
                return;
            } else {
                let hqId = cities[0].id;
                ctx.session.companyGHeadQuarterLocationId = hqId;
                ctx.scene.state.companyGHeadQuarterLocationId = hqId;
                const { data, errors } = await companyEdit({
                    "id": ctx.session.selectedCompanyId,
                    "set": {
                        "head_quarter": ctx.scene.state.companyGHeadQuarterLocationId
                    }

                })
                if (errors) {
                    console.log(errors);
                } else {
                    console.log(data);
                    ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
                }
            }
        }

    } else if (ctx.session.tobeEditedCompanyField == "edit_websit_of_company") {
        ctx.scene.state.tobeEditedCompanyWebsiteField == ctx.message.text;
        const { data, errors } = await companyEdit({
            "id": ctx.session.selectedCompanyId,
            "set": {
                "website": ctx.scene.state.tobeEditedCompanyWebsiteField
            }

        })
        if (errors) {
            console.log(errors);
        } else {
            console.log(data);
            ctx.replyWithHTML("you have successfully edited your company", cancelKeyboard(ctx));
        }
    }
})

export const companyEditSpecificFieldSumitHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {

})

export const companyHandOverHandler = async (ctx: any) => {
    ctx.scene.enter("handOverCompanyScene");
}

export const handOverCompanyInitHandler = async (ctx: any) => {
    ctx.deleteMessage();
    ctx.replyWithHTML("Please send us representative phone number", cancelKeyboard(ctx))
}
export const handOverCompanyPhoneHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.representativeCompanyPhone = ctx.message.text;
        const { data: { users } } = await getUserByPhone({
            phone: ctx.scene.state.representativeCompanyPhone
        })
        if (!users.length) {
            ctx.replyWithHTML("User registered by this number does not exist on our database please use different number", cancelKeyboard(ctx));
            return;
        } else {
            let destId = users[0].id;
            ctx.session.destinationCompanyId = destId;
            let BoldRepNo = ctx.message.text.bold();
            ctx.replyWithHTML(`please confirm representative phone \n\n${BoldRepNo}\n\nNote: They will have access to companies once its given`, {
                reply_markup: {
                    keyboard: [
                        [{ text: "Yes" }, { text: "No" }],
                    ], resize_keyboard: true, one_time_keyboard: true
                }
            })
            return ctx.wizard.next();
        }
    } else {
        ctx.replyWithHTML("Please enter a valid phone number", cancelKeyboard(ctx))
        return
    }
})
export const handOverComapanyYesNoHandler = Telegraf.on(["photo", "text", "contact", "document"], async (ctx: any) => {
    if (ctx.message.text) {
        console.log(ctx.session.selectedCompanyId)
        console.log(ctx.session.sourceCompanyUserId)
        console.log(ctx.session.destinationCompanyId);
        if (ctx.message.text == "Yes") {
            const { data, errors } = await companyHandOver({
                "object": {
                    "entity_id": `${ctx.session.selectedCompanyId}`,
                    "from_user_id": `${ctx.session.sourceCompanyUserId}`,
                    "to_user_id": `${ctx.session.destinationCompanyId}`,
                    "created_by": `${ctx.session.sourceCompanyUserId}`
                }

            })
            if (errors) {
                console.log(errors);
                ctx.replyWithHTML(`Error cease you from handing over your company`, cancelKeyboard(ctx));
            } else {
                console.log(data);
                ctx.replyWithHTML("You have successfully handed over your company", cancelKeyboard(ctx));
            }
            // ctx.scene.leave();

        } else if (ctx.message.text == "No") {
            ctx.replyWithHTML("You haven't handed over your company", cancelKeyboard(ctx));
        }
        // ctx.scene.leave();
    }
})