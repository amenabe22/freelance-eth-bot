import path from "path"
import { Telegraf, Context } from "telegraf";
import { cancelKeyboard } from "../../keybaords/menu_kbs";
    // const download = (url, path, callback) => {
    //     request.head(url, (err, res, body) => {
    //     request(url).pipe(fs.createWriteStream(path)).on('close', callback);
    //   });
    // };
export const uploadCvInitHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any)=>{
    if(ctx.session.userDataCvStatus == null){
        ctx.replyWithHTML(`Please upload your CV here.\n\nNote: uploaded CV will be automatically attached when you apply for a job post. \n\nYou can edit your CV if you want to update it.`, cancelKeyboard);
   }else{
   const cvDocument =  ctx.session.neededCvId;    
   ctx.replyWithHTML(`you have uploaded you cv before.\n\n${cvDocument}\n\nNote: uploaded CV will be automatically attached when you apply for a job post.\n\nIf you want to upload anew one please attach your cv.`, cancelKeyboard);  
   }
})
export const uploadCvHandler = Telegraf.on(["document", "text", "contact", "photo"], async (ctx: any)=>{
    if(ctx.update.message.document){
        const fileName = ctx.update.message.document.file_name;
        const fileType = path.extname(fileName);
        console.log(fileType);
        if(fileType === ".pdf" || fileType === ".docx"){
         console.log(ctx.update.message.document.file_id);  
         const job_seeker_id = ctx.session.userJobSeekerId;
         console.log(job_seeker_id);
    //     const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${cvDocument}`);
    //         console.log(res);
    //         const res2 = await res.json();
    //         const filePath = res2.result.file_path;
    //         const downloadURL =  `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;
    //         console.log(downloadURL);
    //         download(downloadURL, path.join(('uploadedCvs'), `${ctx.from.id}${cvDocument}.pdf`),async () =>(
    //     console.log("done");
    // )

    //Do REST CALL TO UPLOAD CV.
        }else{
            ctx.replyWithHTML('please enter correct document type.', cancelKeyboard);
            return;  
        }
    
    }else{
        ctx.replyWithHTML('please enter correct document type.', cancelKeyboard);
        return;
    }
})
