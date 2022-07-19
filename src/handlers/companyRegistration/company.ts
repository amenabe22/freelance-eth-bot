export const companyGMSelectionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.scene.enter("companyRegistrationGMScene", ctx);
}
export const companyRSelectionHandler = async (ctx: any) => { 
    ctx.answerCbQuery(); 
    ctx.deleteMessage(); 
    ctx.scene.enter("companyRegistrationRScene", ctx); 
}

  