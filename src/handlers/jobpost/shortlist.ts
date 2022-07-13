export const jobApplicationShortlistActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    // ctx.deleteMessage();
    ctx.reply("Applicant has been shortlisted")
}
export const jobApplicationRejectActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply("caught application reject action")
}
export const jobApplicationReviewsActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.reply("caught application reviews action")
}
export const jobApplicationPreviewActionHandler = async (ctx: any) => {
    ctx.answerCbQuery();
    // TODO: format applicant info and attach buttons
    const str = `<b>Michael Hailu</b>  
    ⭐️⭐️⭐️⭐️ (4/5)
    
    Hired by 6 Employers 
    Completed 8 Jobs total
    Shortlisted by 20 employers  
    __________________
    
    First Name: Michael 
    
    Last Name: Hailu  
    
    Date of Birth:  29 
    
    Gender: Male 
    
    Resident City: Addis Ababa 
    
    Phone number: +2519655789
    
    Email: Michael07@gmail.com
    
    Current work/employment Status: Unemployed 
    
    Current Education level: Masters`
    ctx.reply(str)
}

