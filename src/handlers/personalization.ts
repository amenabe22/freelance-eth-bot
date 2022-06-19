import { cancelKeyboard } from "../keybaords/menu_kbs";
import { getUserByTelegramId } from "../services/registration"

export const handleCvUploadSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })
    if (!error) {
        const { users: [{ job_seeker: { cv, id } }] } = data;
        if (!cv) {
            ctx.scene.enter("uploadCvScene")
        } else {
            const cvDocument = ctx.session.neededCvId;
            ctx.replyWithHTML(`you have uploaded you cv before.\n\n${cvDocument}\n\nNote: uploaded CV will be automatically attached when you apply for a job post.\n\nIf you want to upload anew one please attach your cv.`, cancelKeyboard);
            ctx.session.userDataCvStatus = cv;
            ctx.session.userJobSeekerId = id;
            console.log(cv, "cv")
            const neededCvId = cv.split('/')[1];
            ctx.session.neededCvId = neededCvId;
            ctx.scene.enter("uploadCvScene");
        }

    }
}