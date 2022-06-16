export const editRegisterKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "First Name", callback_data: "er_first.name" }, { text: "Last Name", callback_data: "er_last.name" }],
            [{ text: "Email", callback_data: "er_email" }, { text: "Gender", callback_data: "er_gender" }],
            [{ text: "Age", callback_data: "er_age" }],
        ]
    }
}
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

