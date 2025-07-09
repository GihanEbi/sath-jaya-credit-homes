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

// Schema for a credit user registration form
export const creditUserSchema = Joi.object({
  fullName: Joi.string().required().label("Full Name"),
  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .required()
    .label("Gender"),
  birthday: Joi.string()
    .required()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .label("Birthday")
    .messages({ "string.pattern.base": "Invalid Date Format" }),
  permanentAddress: Joi.string().required().label("Permanent Address"),
  phoneNo: Joi.string()
    .required()
    .regex(
      /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91|912)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/,
    )
    .label("Phone Number"),
  address: Joi.string().required().label("Address"),
  nic: Joi.string().required().label("NIC"),
  maritalState: Joi.string()
    .valid("SINGLE", "MARRIED", "DIVORCED", "WIDOWED")
    .required()
    .label("Marital Status"),
  email: Joi.string()
    .required()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .label("Email")
    .optional()
    .empty("")
    .messages({ "string.pattern.base": "Invalid Email" }),
  profilePicture: Joi.string().optional().empty("").label("Profile Picture"),
  nicFrontPicture: Joi.string()
    .required()
    .optional()
    .empty("")
    .label("NIC Front Picture"),
  nicBackPicture: Joi.string()
    .required()
    .optional()
    .empty("")
    .label("NIC Back Picture"),
  locationCertificationPicture: Joi.string()
    .required()
    .optional()
    .empty("")
    .label("Location Certification Picture"),
});

// Schema for a credit user group registration form
export const CreditUserGroupSchema = Joi.object({
  leaderID: Joi.string().required().label("Leader ID"),
  memberIDs: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Member IDs"),
});

// Schema for a user login form
export const LoginSchema = Joi.object({
  email: Joi.string()
    .required()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .label("Email")
    .messages({ "string.pattern.base": "Invalid Email" }),
  password: Joi.string().required().label("Password"),
});

// Schema for a user loan form
export const LoanSchema = Joi.object({
  branchName: Joi.string().required().label("Branch Name"),
  centerName: Joi.string().required().label("Center Name"),
  memberNo: Joi.string().required().label("Member No"),
  teamID: Joi.string().required().label("Team ID"),
  applicantID: Joi.string().required().label("Applicant ID"),
  purposeOfLoan: Joi.string().required().label("Purpose of Loan"),
  mainIncomePerson: Joi.string().required().label("Main Income Person"),
  mainIncomePersonPhoneNo: Joi.string()
    .required()
    .label("Main Income Person Phone No"),
  mainIncomePersonNic: Joi.string().required().label("Main Income Person NIC"),
  monthlyFamilyIncome: Joi.number().required().label("Monthly Family Income"),
  relationship: Joi.string().required().label("Relationship"),
  loanBefore: Joi.boolean().required().label("Loan Before"),
  loanOrganization: Joi.string()
    .empty("")
    .label("Loan Organization")
    .when("loanBefore", {
      is: true,
      then: Joi.string().required().messages({
        "any.required": `"Loan Organization" is required when "Loan Before" is true`,
        "string.empty": `"Loan Organization" cannot be empty when "Loan Before" is true`,
      }),
      otherwise: Joi.optional(),
    }),
  installment: Joi.number().required().label("Installment"),
  loanAmount: Joi.number().required().label("Loan Amount"),
  balanceLoanAmount: Joi.number().required().label("Balance Loan Amount"),
  homeLocation: Joi.string().optional().empty("").label("Home Location"),
  shearedApplicantFullName: Joi.string()
    .required()
    .label("Sheared Applicant Full Name"),
  shearedApplicantAddress: Joi.string()
    .required()
    .label("Sheared Applicant Address"),
  shearedApplicantPhoneNo: Joi.string()
    .required()
    .label("Sheared Applicant Phone No"),
  shearedApplicantNic: Joi.string().required().label("Sheared Applicant NIC"),
  shearedApplicantBirthday: Joi.string()
    .required()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .label("Sheared Applicant Birthday")
    .messages({ "string.pattern.base": "Invalid Date Format" }),
  shearedApplicantMaritalStatus: Joi.string()
    .valid("SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED")
    .required()
    .label("Sheared Applicant Marital Status"),
  guarantorID1: Joi.string().required().label("Guarantor ID 1"),
  guarantorID2: Joi.string().required().label("Guarantor ID 2"),
  guarantorID3: Joi.string().optional().empty("").label("Guarantor ID 3"),
});
