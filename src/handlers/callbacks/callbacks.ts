import { jobSeekerKeyboard } from "../../keybaords/menu_kbs";
import { getUserByTelegramId } from "../../services/registration";

// handler for new customer registration back button click event
export const newCustomerRegistrationCancelHandler = (ctx: any) => {
  ctx.reply("you haven't registered yet. please start the bot again using /start command");
  ctx.scene.leave();
}


export const menuJobseekerSelectionHandler = async (ctx: any) => {
  const { data, error } = await getUserByTelegramId({ telegram_id: ctx.from.id })
  if (!error) {
    const { users } = data
    const [{ usr: { job_seeker } }] = users
    if (!job_seeker) {
      ctx.scene.state.userId = data.data.users[0].id;
      ctx.session.userId = ctx.scene.state.userId
      ctx.scene.enter("registerJobSeekerScene")
    } else {
      ctx.reply(`Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard);
    }
    ctx.reply("you haven't registered yet. please start the bot again using /start command");
    ctx.scene.leave();
  }
}
