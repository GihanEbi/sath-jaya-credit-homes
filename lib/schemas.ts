// schemas.ts
import Joi from "joi";

// Schema for a user registration form
export const UserSchema = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  birthday: Joi.string()
    .required()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .label("Birthday")
    .messages({ "string.pattern.base": "Invalid Date Format" }),
  email: Joi.string()
    .required()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .label("Email")
    .messages({ "string.pattern.base": "Invalid Email" }),
  phoneNo: Joi.string()
    .required()
    .regex(
      /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91|912)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/,
    )
    .label("Phone Number"),
  address: Joi.string().required().label("Address"),
  userGroupId: Joi.string().required().label("User Group"),
});

// Schema for a user group registration form
export const UserGroupSchema = Joi.object({
  groupName: Joi.string().required().label("Group Name"),
  description: Joi.string().optional().empty("").label("Description"),
});
