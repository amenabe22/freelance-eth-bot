// export const formatCompanyRRegistrationMsg = (state: any) => `${state.companyRNameBold}\n . Name: ${state.companyRName}\n . Sectory: ${state.companyRSectorName}\n . Phone: ${state.companyRPhoneNumber}\n . Website: ${state.companyRWebsite}\n . Email: ${state.companyREmail}\n . Employee size: ${state.companyREmployeeSize}\n . HQ Location: ${state.companyRHeadQuarterLocation}\n\n\n\n\n\n...`;
export const formatCompanyRRegistrationMsg = (state: any) => `${state.companyRNameBold}  
Verified Company ✅

60 Jobs Posted | Hired 51 times
__________________

Company Name: ${state.companyRName} 

Industry sector: ${state.companyRSectorName}   

Employee Size: ${state.companyREmployeeSize}

Company Website: ${state.companyRWebsite}

Company Email: ${state.companyREmail}

Company Phone Number: ${state.companyRPhoneNumber}

Company HQ location: ${state.companyRHeadQuarterLocation}

Social Media Links  

${state.companyCRFacebookLink ? `Facebook: ${state.companyCRFacebookLink}` : ''}

${state.companyCRTelegramLink ? `Telegram: ${state.companyCRTelegramLink}` : ''}

${state.companyCRYouTubeLink ? `YouTube: ${state.companyCRYouTubeLink}` : ''}

${state.companyCRTikTokLink ? `TikTok: ${state.companyCRTikTokLink}` : ''}

${state.companyCRTwitterLink ? `Twitter: ${state.companyCRMTwitterLink}` : ''}

${state.companyCGMOther1Link ? `Link 1: ${state.companyCRMOther1Link}` : ''}

${state.companyCGMOther2Link ? `Link 2: ${state.companyCRMOther2Link}` : ''}

${state.companyCGMOther3Link ? `Link 2: ${state.companyCRMOther3Link}` : ''}`;

export const formatCompanyRegistrationMsg = (state: any) => `${state.companyGNameBold}  
Verified Company ✅

60 Jobs Posted | Hired 51 times
__________________

Company Name: ${state.companyGName} 

Industry sector: ${state.companyGSectorName}   

Employee Size: ${state.companyGEmployeeSize}

Company Website: ${state.companyGWebsite}

Company Email: ${state.companyGEmail}

Company Phone Number: ${state.companyGPhoneNumber}

Company HQ location: ${state.companyGHeadQuarterLocation}

Social Media Links  

${state.companyCGMFacebookLink ? `Facebook: ${state.companyCGMFacebookLink}` : ''}

${state.companyCGMTelegramLink ? `Telegram: ${state.companyCGMTelegramLink}` : ''}

${state.companyCGMYouTubeLink ? `YouTube: ${state.companyCGMYouTubeLink}` : ''}

${state.companyCGMTikTokLink ? `TikTok: ${state.companyCGMTikTokLink}` : ''}

${state.companyCRTwitterLink ? `Twitter: ${state.companyCRTwitterLink}` : ''}

${state.companyCRLinkedInLink ? `Link 1: ${state.companyCRLinkedInLink}` : ''}

${state.companyCROther1Link ? `Link 2: ${state.companyCROther1Link}` : ''}

${state.companyCROther2Link ? `Link 2: ${state.companyCROther2Link}` : ''}

${state.companyCROther3Link ? `Link 2: ${state.companyCROther3Link}` : ''}`;
