import path from "path"
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import { Telegraf, Context } from "telegraf";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { uploadJobseekerCv } from "../../services/cv_process";
export const uploadCvInitHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any) => {
if(ctx.session.neededCvId){
    ctx.replyWithHTML('You have uploaded your cv before. the above doucument is your CV uploaded earlier.\n\nuploaded CV will be automatically attached when you apply for a job post.\n\nIf you want to upload new CV please attach it here.', cancelKeyboard)
}else{
    ctx.replyWithHTML(`Please upload your CV here.\n\nNote: uploaded CV will be automatically attached when you apply for a job post. \n\nYou can edit your CV if you want to update it.`, cancelKeyboard);
}
})
export const uploadCvHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any) => {
    if (ctx.update.message.document) {
        const fileName = ctx.update.message.document.file_name;
        const fileType = path.extname(fileName);
        console.log(fileType);
        const allowed_ext = [".pdf", ".docx"]
        if (allowed_ext.includes(fileType)) {
            const job_seeker_id = ctx.session.userJobSeekerId;
            const { downloadURL }: any = await fetchTelegramDownloadLink(ctx.update.message.document.file_id)
            const fname = `${ctx.from.id}${fileType}`
            const base = path.basename(__dirname);
            // var relativePath = path.relative(process.cwd(), `files/cv/${fname}`);
            console.log(base, "==>", process.cwd)
            download(downloadURL, `files/cv/${fname}`,).then(async () => {
                const { data } = await uploadJobseekerCv(job_seeker_id, path.join(`files/cv/${fname}`))
                if (data) {
                    console.log(data);
                    ctx.reply("You have successfully uplead your cv.", cancelKeyboard)
                }
            })
  
        } else {
            ctx.replyWithHTML('please enter correct document type. allwed(*.pdf, *.docx)', cancelKeyboard);
            return;
        }

    } else {
        ctx.replyWithHTML('please enter correct document type. allwed(*.pdf, *.docx)', cancelKeyboard);
        return;
    }
})
