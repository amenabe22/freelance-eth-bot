import { cancelKeyboard } from "../keybaords/menu_kbs";
import { getUserByTelegramId } from "../services/registration"

export const handleCvUploadSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })
    if (!error) {
        const { users: [{ job_seeker: { cv, id } }] } = data;
        if (!cv) {
            ctx.session.userJobSeekerId = id;
            ctx.scene.enter("uploadCvScene")
        } else {
            ctx.session.userDataCvStatus = cv;
            ctx.session.userJobSeekerId = id;
            const neededCvId = cv.split('/')[1];
            ctx.session.neededCvId = neededCvId; 
            await ctx.replyWithDocument({source: `files/cv/${ctx.from.id}.pdf` })         
            await ctx.scene.enter("uploadCvScene");
        }
 
    }
} 