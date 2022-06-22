export const companyGMSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("companyRegistrationGMScene");
}
export const companyRSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("companyRegistrationRScene");
}

