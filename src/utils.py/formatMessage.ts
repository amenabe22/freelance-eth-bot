export const formatCompanyRegistrationMsg = (state: any) => {
    `${state.companyGNameBold}\n . Name: ${state.companyGName}\n . Sectory: ${state.companyGSectorName}\n . Phone: ${state.companyGPhoneNumber}\n . Website: ${state.companyGWebsite}\n . Email: ${state.companyGEmail}\n . Employee size: ${state.companyGEmployeeSize}\n . HQ Location: ${state.companyGHeadQuarterLocation}\n\n\n\n\n\n...`
}