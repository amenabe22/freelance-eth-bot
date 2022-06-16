export const companyGMSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   ctx.replyWithHTML('please enter the name of your company',ctx.scene.enter("companyRegistrationGMScene"));
}
export const companyRSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   ctx.replyWithHTML('please enter the name of your company',ctx.scene.enter("companyRegistrationRScene"));
}