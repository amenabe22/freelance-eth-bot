
// Remove parsemode it's deprecated
export const shareContactKeyboard = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "Share Contact",
                    request_contact: true,
                },
                { text: "Cancel" }
            ],
        ],
        one_time_keyboard: true,
    },
}
export const genderKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "male" }, { text: "female" }],
            [{ text: "Cancel" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}
export const emailRegisterKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Skip" }, { text: "Cancel" }],
        ], resize_keyboard: true, one_time_keyboard: true
    }
}
export const registerUserKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editRegisterUser" }, { text: "Register", callback_data: "RegisterUser" }]
        ]
    }
}
export const registerUserWithAgeKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Edit", callback_data: "editRegisterWithAgeUser" }, { text: "Register", callback_data: "RegisterWithAgeUser" }]
        ]
    }
}
export const ageKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Gregorian calendar" }],
            [{ text: "Ethiopian calendar" }],
            [{ text: "Age" }],
            [{ text: "Cancel" }]
        ], resize_keyboard: true, one_time_keyboard: true
    }
}

