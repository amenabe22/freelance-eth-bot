import { jobSeekerKeyboard } from "../../keybaords/menu_kbs";

// handler for new customer registration back button click event
export const newCustomerRegistrationCancelHandler = (ctx: any) => {
  ctx.reply("you haven't registered yet. please start the bot again using /start command");
  ctx.scene.leave();
}

// handler for job seeer scene back button event
export const registerJobSeekerCancelHandler = (ctx: any) => {
  ctx.reply(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard)
  ctx.scene.leave();
}
