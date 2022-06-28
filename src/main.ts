import path from "path";
import { bot } from "./setup";


async function main() {
    await bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().then(() => console.log("bot launched")).catch(e => console.log(e, "Errr"))