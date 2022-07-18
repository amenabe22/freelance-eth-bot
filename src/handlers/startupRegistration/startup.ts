import {LicensedStartupKeyboard, UnlicensedStartupKeyboard} from "../../keybaords/company.registration_kbs"
export const startupLicensedActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    let boldGManager = "Startup Manager ID".bold();
    let boldRepresentative = "Representative".bold();
    ctx.replyWithHTML(`Please select Startup Manager or Startup Representative of a startup to registor\n\nRequirements-------\n${boldGManager}\n  . G/Manager ID\n  . License Photo\n${boldRepresentative}\n  . Representative ID\n  . Written letter with stamp`, LicensedStartupKeyboard);
}
export const startupUnlicensedActionHandler = async (ctx: any) =>{
    ctx.answerCbQuery();
    ctx.deleteMessage();
    await ctx.replyWithHTML(`To register your unlicensed startups you need to provide the following:\n\n  1. A photo of one of the founder’s ID (ID can be driver’s license, passport, company/employee ID or residence ID)\n  2.Other mandatory and optional information`)
    await ctx.scene.enter("startupRegistrationUscene");
}
export const startupLGMSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("startupRegistrationLGMscene");
}
export const startupUGMSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("startupRegistrationUGMscene");
}
export const startupLRSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("startupRegistrationLRscene");
}
export const startupURSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("startupRegistrationURscene");
}