import path from "path"
import { download, fetchTelegramDownloadLink } from "../../utils.py/uploads";
import { Telegraf, Context } from "telegraf";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { uploadJobseekerCv } from "../../services/cv_process";
// const download = (url, path, callback) => {
//     request.head(url, (err, res, body) => {
//     request(url).pipe(fs.createWriteStream(path)).on('close', callback);
//   });
// };
export const uploadCvInitHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any) => {
    // if (ctx.session.userDataCvStatus == null) {
    //     ctx.replyWithHTML(`Please upload your CV here.\n\nNote: uploaded CV will be automatically attached when you apply for a job post. \n\nYou can edit your CV if you want to update it.`, cancelKeyboard);
    // } else {
    //     const cvDocument = ctx.session.neededCvId;
    //     ctx.replyWithHTML(`you have uploaded you cv before.\n\n${cvDocument}\n\nNote: uploaded CV will be automatically attached when you apply for a job post.\n\nIf you want to upload anew one please attach your cv.`, cancelKeyboard);
    // }
    // return ctx.wizard.next()
    ctx.replyWithHTML(`Please upload your CV here.\n\nNote: uploaded CV will be automatically attached when you apply for a job post. \n\nYou can edit your CV if you want to update it.`, cancelKeyboard);

})
export const uploadCvHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any) => {
    if (ctx.update.message.document) {
        const fileName = ctx.update.message.document.file_name;
        const fileType = path.extname(fileName);
        console.log(fileType);
        const allowed_ext = [".pdf", ".docx"]
        if (allowed_ext.includes(fileType)) {
            const job_seeker_id = ctx.session.userJobSeekerId;
            const { downloadURL } = await fetchTelegramDownloadLink(ctx.update.message.document.file_id)
            const fname = `${ctx.from.id}${fileType}`
            const base = path.basename(__dirname);
            // var relativePath = path.relative(process.cwd(), `files/cv/${fname}`);
            console.log(base,"==>",process.cwd)
            download({ url: downloadURL, path: `files/cv/${fname}` },
                async () => {
                    const { data } = await uploadJobseekerCv(job_seeker_id, path.join(`files/cv/${fname}`))
                    if (data) {
                        ctx.reply("You have successfully uplead your cv.", cancelKeyboard)
                    }
                }
            )

        } else {
            ctx.replyWithHTML('please enter correct document type. allwed(*.pdf, *.docx)', cancelKeyboard);
            return;
        }

    } else {
        ctx.replyWithHTML('please enter correct document type.', cancelKeyboard);
        return;
    }
})
