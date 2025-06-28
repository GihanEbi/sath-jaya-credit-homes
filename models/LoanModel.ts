import { loanConstants } from "@/constants/loan_constants";
import mongoose, { Schema, Document } from "mongoose";

// loan installment history object
export interface ILoanInstallmentList {
  installmentNo: number;
  installmentAmount: number;
  installmentDate: Date;
  status: string; // e.g., "PAID", "PENDING" , "overdue"
}

export interface ILoan extends Document {
  // branch details
  ID: string;
  branchName: string;
  centerName: string;
  memberNo: string;
  //   applicant details
  teamID: string;
  applicantID: string;
  purposeOfLoan: string;
  mainIncomePerson: string;
  mainIncomePersonPhoneNo: string;
  mainIncomePersonNic: string;
  monthlyFamilyIncome: string;
  relationship: string;
  loanBefore: boolean;
  loanOrganization?: string;
  loanAmount: number;
  installment: number;
  balanceLoanAmount: number;
  homeLocation: string;

  //   sheared applicant details
  shearedApplicantFullName: string;
  shearedApplicantAddress: string;
  shearedApplicantPhoneNo: string;
  shearedApplicantNic: string;
  shearedApplicantBirthday: string;
  shearedApplicantMaritalStatus: string;

  //   guarantor details
  guarantorID1: string;
  guarantorID2: string;
  guarantorID3?: string;

  // common fields
  loanStatus: string; // Default status is pending
  interestRate?: number; // Optional field to track interest rate. set the interest rate for the loan
  installmentTime?: number; // Optional field to track installment time in days.
  noOfInstallments?: number; // Optional field to track number of installments
  loanStartedDate?: Date; // Optional field to track when the loan started
  loanInstallmentsHistory?: ILoanInstallmentList[]; // Optional field to track installment history
  nextInstallmentDate?: Date; // Optional field to track next installment date
  nextInstallmentAmount?: number; // Optional field to track next installment amount
  approvedBy?: string; // Optional field to track who approved the loan
  rejectedBy?: string; // Optional field to track who rejected the loan
  rejectedReason?: string; // Optional field to track reason for rejection
  ongoingBy?: string; // Optional field to track who is handling the ongoing loan
  completedBy?: string; // Optional field to track who completed the loan
}

const loanSchema = new Schema<ILoan>(
  {
    // branch details
    ID: { type: String, required: true, unique: true },
    branchName: { type: String, required: true },
    centerName: { type: String, required: true },
    memberNo: { type: String, required: true },

    //   applicant details
    teamID: { type: String, required: true },
    applicantID: { type: String, required: true }, // Unique applicant ID
    purposeOfLoan: { type: String, required: true },
    mainIncomePerson: { type: String, required: true },
    mainIncomePersonPhoneNo: { type: String, required: true },
    mainIncomePersonNic: { type: String, required: true },
    monthlyFamilyIncome: { type: String, required: true },
    relationship: { type: String, required: true },
    loanBefore: { type: Boolean, default: false },
    loanOrganization: { type: String, default: "" }, // Optional
    loanAmount: { type: Number, required: true },
    installment: { type: Number, required: true },
    balanceLoanAmount: { type: Number, required: true }, // Default to 0
    homeLocation: { type: String, required: false },

    //   sheared applicant details
    shearedApplicantFullName: { type: String, required: true },
    shearedApplicantAddress: { type: String, required: true },
    shearedApplicantPhoneNo: { type: String, required: true },
    shearedApplicantNic: { type: String, required: true },
    shearedApplicantBirthday: { type: String, required: true },
    shearedApplicantMaritalStatus: { type: String, required: true },

    //   guarantor details
    guarantorID1: { type: String, required: true },
    guarantorID2: { type: String, required: true },
    guarantorID3: { type: String, default: "" },

    // common fields
    loanStatus: {
      type: String,
      enum: Object.values(loanConstants.status),
      required: true,
      default: loanConstants.status.pending, // Default status is pending
    },
    interestRate: { type: Number, default: 0 }, // Optional field to track interest rate
    installmentTime: { type: Number, default: 30 }, // Optional field to track  installment time in days
    noOfInstallments: { type: Number, default: 0 }, // Optional field to track number of installments
    loanStartedDate: { type: Date, default: null }, // Optional field to track when the loan started
    loanInstallmentsHistory: [
      {
        installmentNo: { type: Number, required: true },
        installmentAmount: { type: Number, required: true },
        installmentDate: { type: Date, required: true },
        paidDate: { type: Date, required: false }, // Optional field to track when the installment was paid
        status: {
          type: String,
          enum: Object.values(loanConstants.installmentStatus),
          required: true,
          default: loanConstants.installmentStatus.pending,
        },
        approvedBy: { type: String, required: false, ref: "users" },
      },
    ],
    nextInstallmentDate: { type: Date, default: null }, // Optional field to track next installment date
    nextInstallmentAmount: { type: Number, default: 0 }, // Optional field
    approvedBy: { type: String, default: "", ref: "users" }, // Optional field to track who approved the loan
    rejectedBy: { type: String, default: "", ref: "users" }, // Optional field to track who rejected the loan
    rejectedReason: { type: String, default: "" }, // Optional field to track reason for rejection
    ongoingBy: { type: String, default: "", ref: "users" }, // Optional field to track who is handling the ongoing loan
    completedBy: { type: String, default: "", ref: "users" }, // Optional field to track who completed the loan
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.loans || mongoose.model("loans", loanSchema);
