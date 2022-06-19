import fs from "fs"
import request from "request";
import { BOT_TOKEN } from "../constants";
import fetch from "cross-fetch"

export const fetchTelegramDownloadLink = async (fileid: string) => {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileid}`);
    if (res.status == 200) {
        const data = await res.json()
        const { result: { file_path } }: any = data
        const downloadURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;
        return { downloadURL, err: null }
    } else {
        return { downloadURL: null, err: "failed to fetch download link" }
    }
}

export const download = (async (url: string, path: string) => {
    const { body }: any = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        body.pipe(fileStream);
        body.on("error", reject);
        fileStream.on("finish", resolve);
    });
});

// export const download = ({ url, path }: any, callback: any) => {
//     request.head(url, () => {
//         request(url).pipe(fs.createWriteStream(path)).on("close", callback)
//     });
// };
