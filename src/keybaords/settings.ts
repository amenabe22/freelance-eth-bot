export const settingKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Languages" }, { text: "Account" }],
            [{ text: "Terms and Conditions" }],
            [{ text: "Main Menu" }]
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const settingKeyboardAM = {

    reply_markup: {
        keyboard: [
            [{ text: "Languages" }, { text: "Account" }],
            [{ text: "Terms and Conditions" }],
            [{ text: "Main Menu" }]
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const changeToAmharicKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Amharic" }, { text: "English" }],
            [{ text: "Terms and Conditions" }],
            [{ text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const changeToEnglishKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "English" }, { text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const editProfileKeybaord = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "EditProfile" }],
        ],
    }
}
export const editProfileKeybaordAM = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "አስተካክል", callback_data: "EditProfile" }],
        ],
    }
}
export const editDetailProfileKeyboard = {

    reply_markup: {
        keyboard: [
            [{ text: "Name" }, { text: "Education Level" }],
            [{ text: "Email" }, { text: "Birth date" }],
            [{ text: "Availability" }, { text: "Gender" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}
export const editDetailProfileKeyboardAM = {

    reply_markup: {
        keyboard: [
            [{ text: "English" }, { text: "Main Menu" }],
        ], resize_keyboard: true, one_time_keyboard: true,
    }
}

export const editDetailProfileInlineKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edit-Name" }, { text: "Education Level", callback_data: "edit-Education Level" }],
            [{ text: "Email", callback_data: "edit-Email" }, { text: "Birth date", callback_data: "edit-Birth date" }],
            [{ text: "Availability", callback_data: "edit-Availability" }, { text: "Gender", callback_data: "edit-Gender" }],
        ]
    }
}
export const editDetailProfileInlineKeyboardAM = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Name", callback_data: "edit-Name" }, { text: "Education Level", callback_data: "edit-Education Level" }],
            [{ text: "Email", callback_data: "edit-Email" }, { text: "Birth date", callback_data: "edit-Birth date" }],
            [{ text: "Availability", callback_data: "edit-Availability" }, { text: "Gender", callback_data: "edit-Gender" }],
        ]
    }
}
export const confirmProfileEditKeyboard = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Confirm", callback_data: "confirmEditProfile" }],
        ],
    }
}
export const confirmProfileEditKeyboardAM = {

    reply_markup: {
        inline_keyboard: [
            [{ text: "Confirm", callback_data: "confirmEditProfile" }],
        ],
    }
}