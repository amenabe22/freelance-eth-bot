import { getUserByTelegramId } from "../services/registration"

export const handleCvUploadSelectionHandler = async (ctx: any) => {
    const { data, error } = await getUserByTelegramId({ telegram_id: JSON.stringify(ctx.from.id) })
    if (!error) {
        const { users: [{ job_seeker: { cv } }] } = data;
        ctx.session.userDataCvStatus = cv;
        const neededCvId = cv.split('/')[1];
        ctx.session.neededCvId = neededCvId;
        ctx.scene.enter("uploadCvScene");
    }
}