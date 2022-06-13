import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import { newCustomerRegistrationCancel } from "../handlers/callbacks"

export const ageInputStyleScene = new CoreScene(
  "ageInputStyleScene",
  [
    hdlr.ageInitHandler,
    hdlr.ageInputStyleHandler,
  ]
)

export const newCustomerRegistrationScene = new CoreScene(
  "newCustomerRegistrationScene",
  [
    hdlr.registrationInitHandler,
    hdlr.phoneNumberRegisterHandler,
    hdlr.firstNameRegisterHandler,
    hdlr.lastNameRegisterHandler,
    hdlr.genderRegisterHandler,
    hdlr.residentCityRegisterHandler,
    hdlr.chooseAgeInputStyleHandler,
    hdlr.yearOfBirthRegisterHandler,
    hdlr.monthOfBirthRegisterHandler,
    hdlr.dateOfBirthRegisterHandler
  ],
  [
    newCustomerRegistrationCancel
  ]
)

export const registerJobSeekerScene = new CoreScene(
  "registerJobSeekerScene",
  [
    hdlr.availablityHandler
  ]
)