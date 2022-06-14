import * as hdlr from "../handlers"
import { CoreScene } from "./scene"
import { newCustomerRegistrationCancel, registerJobSeekerCancel } from "../handlers/callbacks"

export const ageInputStyleScene = new CoreScene(
  "ageInputStyleScene",
  {
    enter: null,
    handlers: [
      hdlr.ageInitHandler,
      hdlr.ageInputStyleHandler,
    ]
  }
)

export const newCustomerRegistrationScene = new CoreScene(
  "newCustomerRegistrationScene",
  {
    enter: null,
    handlers: [
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
    ]
  },
  [
    newCustomerRegistrationCancel
  ]
)

export const registerJobSeekerScene = new CoreScene(
  "registerJobSeekerScene",
  // add enter handler for each middleware event
  {
    // enter handler
    enter: hdlr.jobSeekerInitHandler,
    // steps handler
    handlers: [
      hdlr.availablityHandler,
      hdlr.educationalLevelHandler,
      hdlr.workStatusHandler
    ]
  },
  // middlewares for buttons
  [
    registerJobSeekerCancel
  ]
)