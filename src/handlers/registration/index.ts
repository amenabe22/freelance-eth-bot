import { bot } from "../../setup";
import { Telegraf, Context } from "telegraf"
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { fetchCities, fetchCity } from "../../services/basic";
import {
    ageKeyboard, genderKeyboard,
    registerUserKeyboard,
    registerUserWithAgeKeyboard, shareContactKeyboard
} from "../../keybaords/registration_kbs";
import { registerNewBotUser } from "../../services/registration";
import { chooseLanguageKeyboard } from "../../keybaords/language_kbs";

let globalState: any;

// registration handler with date of birth
export const registerUserHandler = async (ctx: any) => {
    console.log("register handler triggered")
    const {
        phoneNumberRegister,
        firstNameRegister,
        lastNameRegister,
        genderRegister,
        residentCityRegister,
        chooseAgeInputStyle,
        calanderType,
        yearOfBirthRegister,
        monthOfBirthRegister,
        dateOfBirthRegister
    } = globalState;
    ctx.deleteMessage();
    const dob = `${yearOfBirthRegister}-${monthOfBirthRegister}-${dateOfBirthRegister}`
    const { data, errors } = await registerNewBotUser({
        obj: {
            first_name: firstNameRegister,
            last_name: lastNameRegister,
            gender: genderRegister,
            date_of_birth: dob,
            //  "email": `${email}`,
            phone: phoneNumberRegister,
            telegram_id: JSON.stringify(ctx.from.id),
            residence_city_id: residentCityRegister
        }
    })
    if (!errors) {
        ctx.replyWithHTML("you have successfully registered", chooseLanguageKeyboard)
    } else {
        const [{ message }] = errors
        ctx.replyWithHTML(`you haven't registered because of ${message}. please start the bot again using /start command`);
    }
}

// reigstration handler with age
export const ageRegistrationHandlder = async (ctx: any) => {
    ctx.deleteMessage();
    ctx.answerCbQuery();
    const {
        phoneNumberRegister,
        firstNameRegister,
        lastNameRegister,
        genderRegister,
        residentCityRegister,
        chooseAgeInputStyle,
        ageInputStyle
    } = globalState;
    const { data, errors } = await registerNewBotUser({
        obj: {
            "first_name": firstNameRegister,
            "last_name": lastNameRegister,
            "gender": genderRegister,
            "age": 25,
            //  "email": `${email}`,
            "phone": phoneNumberRegister,
            "telegram_id": JSON.stringify(ctx.from.id),
            "residence_city_id": residentCityRegister
        }
    })
    if (!errors) {
        ctx.replyWithHTML("you have successfully registered", chooseLanguageKeyboard)
    } else {
        const [{ message }] = errors
        ctx.replyWithHTML(`you haven't registered because of ${message}. please start the bot again using /start command`);
    }
}

export const registrationInitHandler = Telegraf.on(["text", "contact", "document", "photo"],
    async (ctx: any) => {
        await ctx.replyWithHTML("It seems you are new user for the bot, let's register you.")
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    })

export const ageInitHandler = Telegraf.on(["text", "contact", "document", "photo"],
    async (ctx: any) => {
        await ctx.replyWithHTML("Please enter your age. Example: 25")
        return ctx.wizard.next();
    })


export const phoneNumberRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"],
    async (ctx: any) => {
        if (!ctx.update.message.contact) {
            ctx.replyWithHTML(`Please enter a valid phone number!`, shareContactKeyboard)
            return;
        } else {
            ctx.scene.state.phoneNumberRegister = ctx.update.message.contact.phone_number;
            console.log("condition passed: ", ctx.scene.state.phoneNumberRegister)
            await ctx.replyWithHTML("Please enter your first name.", cancelKeyboard);
            return ctx.wizard.next();
        }
    })


export const firstNameRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.firstNameRegister = ctx.message.text;
        console.warn("first", ctx.message.text)
        await ctx.replyWithHTML(`please enter your last name.`, cancelKeyboard);
        return ctx.wizard.next();
    }
})

export const lastNameRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.lastNameRegister = ctx.message.text;
        await ctx.replyWithHTML("please enter your gender.", genderKeyboard);
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML("Please enter a valid last name!", cancelKeyboard);
        return;
    }
})

export const genderRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"],
    async (ctx: any) => {
        if (ctx.message.text) {
            ctx.scene.state.genderRegister = ctx.message.text;
            const { data, error } = await fetchCities()
            if (data) {
                const { cities } = data;
                let cnames = cities.map((nm: any) => nm.name);
                ctx.session.cityNames = cnames
                ctx.replyWithHTML("please enter your residence city.", {
                    reply_markup: JSON.stringify({
                        keyboard: cnames.map((x: string, _: string) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                })
            }
            return ctx.wizard.next();
        } else {
            ctx.replyWithHTML("Please enter a valid gender!", genderKeyboard);
            return;
        }
    })

export const residentCityRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.residentCityRegister = ctx.message.text;
        const { data, error } = await fetchCity({ name: ctx.scene.state.residentCityRegister })


        const { cities } = data
        console.log(cities.length, "bpt 1")
        if (cities.length == 0) {
            ctx.replyWithHTML("Please enter a valid recidency city!", {
                reply_markup: JSON.stringify({
                    keyboard: ctx.session.cityNames.map((x: string, xi: string) => ([{
                        text: x,
                    }])), resize_keyboard: true, one_time_keyboard: true,
                }),
            })
            return;
        } else {
            let cityId = cities[0].id;
            console.log("bpt 2", cityId)
            ctx.session.residentCityRegister = cityId;
            ctx.scene.state.residentCityRegister = cityId;
            ctx.replyWithHTML("Please choose how you want to enter your age. using Date of Birth or Age.", ageKeyboard);
            return ctx.wizard.next();
        }
    }
    else {
        ctx.replyWithHTML(ctx.chat.id, `Please enter a valid recidency city!`, {
            reply_markup: JSON.stringify({
                keyboard: ctx.session.cityNames.map((x: any, _: any) => ([{
                    text: x,
                }])), resize_keyboard: true, one_time_keyboard: true,
            }),
        })
        return;
    }
})

export const chooseAgeInputStyleHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        globalState = ctx.scene.state
        ctx.scene.state.chooseAgeInputStyle = ctx.message.text;
        if (ctx.scene.state.chooseAgeInputStyle == "Age") {
            return ctx.scene.enter("ageInputStyleScene");
        } else if (ctx.scene.state.chooseAgeInputStyle == "Gregorian calendar") {
            ctx.scene.state.calanderType = "Gregorian";
            await ctx.replyWithHTML("Please enter the year in 4 digit numbers. Example: 1995", cancelKeyboard);
            return ctx.wizard.next();
        } else if (ctx.scene.state.chooseAgeInputStyle == "Ethiopian calendar") {
            ctx.scene.state.calanderType = "Ethiopian";
            await ctx.replyWithHTML("Please enter the year in 4 digit numbers. Example: 1995", cancelKeyboard);
            return ctx.wizard.next();
        } else {
            await ctx.replyWithHTML("please enter the correct option!", ageKeyboard);
            return;
        }

    } else {
        await ctx.replyWithHTML(ctx.chat.id, "please enter the correct option!", ageKeyboard);
        return;
    }
})

export const ageInputStyleHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.ageInputStyle = ctx.message.text;
        // update age input style in global state
        globalState.ageInputStyle = ctx.scene.state.ageInputStyle
        const {
            phoneNumberRegister,
            firstNameRegister,
            lastNameRegister,
            genderRegister,
            residentCityRegister,
            chooseAgeInputStyle,
            ageInputStyle
        } = globalState;
        // userEmailRegister is removed because email isn't being handled yet
        ctx.replyWithHTML(`\n\nFirstName: ${globalState.firstNameRegister}\nLastName: ${lastNameRegister}\nEmail: nGender: ${genderRegister}\Age: ${ageInputStyle}`, registerUserWithAgeKeyboard);
        ctx.scene.leave();
    } else {
        ctx.replyWithHTML("Please enter a valid age number", cancelKeyboard);
    }
})
export const yearOfBirthRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.yearOfBirthRegister = ctx.message.text;
        if (ctx.scene.state.chooseAgeInputStyle == "Gregorian calendar") {
            await ctx.replyWithHTML("Please enter the month in numbers from 1 to 12. Example: 9", cancelKeyboard);
        } else if (ctx.scene.state.chooseAgeInputStyle == "Ethiopian calendar") {
            await ctx.replyWithHTML("Please enter the month in numbers from 1 to 13. Example: 9", cancelKeyboard);
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML("Please enter a valid year!", cancelKeyboard);
        return;
    }
})

export const monthOfBirthRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.monthOfBirthRegister = ctx.message.text;
        if (ctx.scene.state.chooseAgeInputStyle == "Gregorian calendar") {
            await ctx.replyWithHTML("Please enter the day from 1 to 31. Example: 19", cancelKeyboard);
        } else if (ctx.scene.state.chooseAgeInputStyle == "Ethiopian calendar") {
            await ctx.replyWithHTML(ctx.chat.id, "Please enter the day from 1 to 30. Example: 19", cancelKeyboard);
        }
        return ctx.wizard.next();
    } else {
        ctx.replyWithHTML("Please enter a valid day number from 1 to 31!", cancelKeyboard);
        return;
    }
})

export const dateOfBirthRegisterHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        if (ctx.scene.state.chooseAgeInputStyle == "Gregorian calendar") {
            ctx.session.ethiopianDOB = false;
        } else if (ctx.scene.state.chooseAgeInputStyle == "Ethiopian calendar") {
            ctx.session.ethiopianDOB = true;
        }
        ctx.session.isEthiopianDOB = ctx.session.ethiopianDOB;
        ctx.session.userRecidenceCityRegister = ctx.session.RecidenceCityRegister;
        ctx.scene.state.dateOfBirthRegister = ctx.message.text;
        ctx.session.yearOfBirthRegister = ctx.scene.state.yearOfBirthRegister;
        ctx.session.monthOfBirthRegister = ctx.scene.state.monthOfBirthRegister;
        ctx.session.dateOfBirthRegister = ctx.scene.state.dateOfBirthRegister;
        ctx.session.phoneNumberRegister = ctx.scene.state.phoneNumberRegister;
        ctx.session.firstNameRegister = ctx.scene.state.firstNameRegister;
        ctx.session.lastNameRegister = ctx.scene.state.lastNameRegister;
        ctx.session.genderRegister = ctx.scene.state.genderRegister;
        globalState = ctx.scene.state
        // ctx.session.emailRegister = ctx.scene.state.emailRegister;
        // userEmailRegister = ctx.session.emailRegister;
        ctx.replyWithHTML(`here is your data. \n\nFirstName: ${ctx.session.firstNameRegister}\nLastName: ${ctx.session.lastNameRegister}\nGender: ${ctx.session.genderRegister}\nDateOfBirth: ${ctx.session.yearOfBirthRegister}-${ctx.session.monthOfBirthRegister}-${ctx.session.dateOfBirthRegister}`, registerUserKeyboard)
    } else {
        ctx.replyWithHTML("Please enter a valid day number from 1 to 31", cancelKeyboard);
        return;
    }
})
