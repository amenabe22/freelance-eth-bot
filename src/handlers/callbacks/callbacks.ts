import { fetchCities } from "../../services/basic";
import { jobSeekerKeyboard, chooseCompanyStartupKeyboard } from "../../keybaords/menu_kbs";
var boldCompany = "Company".bold();
var boldStartup = "Startup".bold();

// handler for new customer registration skip button click event
export const newCustomerRegistrationSkipHandler = async (ctx: any) => {
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

    return ctx.scene.ctx.wizard.next()
  }
}

// handler for new customer registration back button click event
export const newCustomerRegistrationCancelHandler = (ctx: any) => {
  ctx.replyWithHTML("you haven't registered yet. please start the bot again using /start command");
  ctx.scene.leave();
}

// handler for job seeer scene back button event
export const registerJobSeekerCancelHandler = (ctx: any) => {
  ctx.replyWithHTML(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard)
  ctx.scene.leave();
}
// handler for company startup registration back button click event

export const companyRegistraionCancelHandler = (ctx: any) => {
  ctx.replyWithHTML(ctx.i18n.t('companyStartupMsg'), chooseCompanyStartupKeyboard(ctx));
  ctx.scene.leave();

}