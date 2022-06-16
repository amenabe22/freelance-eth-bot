import { jobSeekerKeyboard ,chooseCompanyStartupKeyboard} from "../../keybaords/menu_kbs";
var boldCompany = "Company".bold();
var boldStartup = "Startup".bold();
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
// handler for new customer registration back button click event
export const companyRegistraionCancelHandler = (ctx: any) => {
  ctx.replyWithHTML(`Please Select Company or Startup to register and post jobs.\n\nRequirements---\n${boldCompany}\n   . General manager ID\n   . License Photo\n${boldStartup}\n   . General Manager ID\n   . License Photo`, chooseCompanyStartupKeyboard);
  ctx.scene.leave();

}