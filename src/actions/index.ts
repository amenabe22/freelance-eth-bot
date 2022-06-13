import * as hdlr from "../handlers";


export const registerWithAgeAction = {
    key: "RegisterWithAgeUser",
    handler: hdlr.ageRegistrationHandlder
}

export const registerUserHandlerDob = {
    key: "RegisterUser",
    handler: hdlr.registerUserHandler
}


export const AmharicSelectionAction = {
    key: "Amharic",
    handler: hdlr.amharicSelectionHandler
}

export const EnglishSelectionAction = {
    key: "English",
    handler: hdlr.englishSelectionHandler
}

