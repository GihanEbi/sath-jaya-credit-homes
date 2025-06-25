import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api/loan";
type params = {
  pageNo: number;
  pageSize: number;
};
type searchValue = string | undefined;

type Loan = {
  branchName: string;
  centerName: string;
  memberNo: string;
  teamID: string;
  applicantID: string;
  purposeOfLoan: string;
  mainIncomePerson: string;
  mainIncomePersonPhoneNo: string;
  mainIncomePersonNic: string;
  monthlyFamilyIncome: number;
  relationship: string;
  loanBefore: boolean;
  loanOrganization: string;
  loanAmount: number;
  installment: number;
  balanceLoanAmount: number;
  homeLocation: string;
  shearedApplicantFullName: string;
  shearedApplicantAddress: string;
  shearedApplicantPhoneNo: string;
  shearedApplicantNic: string;
  shearedApplicantBirthday: string; // Assuming this is a date field
  shearedApplicantMaritalStatus: string; // Assuming this is a string field
  guarantorID1: string;
  guarantorID2: string;
  guarantorID3?: string;
};

type loanActions = {
  loanID: string;
  action: string; // e.g., "approve", "reject", "ongoing", "complete"
};

type ongoingLoanActions = {
  loanID: string;
  action: string; // e.g., "approve", "reject", "ongoing", "complete"
  interestRate: number; // interest rate for the loan
  installmentTime: number; // installment time in days set number of installments
};

type updateInstallment = {
  loanID: string;
  installmentNo: number;
};

export async function get_loans(params: params, searchValue: searchValue) {
  const queryParams = new URLSearchParams({
    pageNo: params.pageNo.toString(),
    pageSize: params.pageSize.toString(),
  });

  try {
    const res = await fetch(`${commonUrl}/get-loan?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify({ searchValue }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function create_loan(loanData: Loan) {
  try {
    const res = await fetch(`${commonUrl}/create-loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loanData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function approve_reject_loan(loanAction: loanActions) {
  try {
    const res = await fetch(`${commonUrl}/accept-reject-pending-loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loanAction),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function set_to_ongoing_loan(loanAction: ongoingLoanActions) {
  try {
    const res = await fetch(`${commonUrl}/set-to-ongoing-loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loanAction),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function update_installment(loanAction: updateInstallment) {
  try {
    const res = await fetch(`${commonUrl}/update-installments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loanAction),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function complete_loan(loanAction: loanActions) {
  try {
    const res = await fetch(`${commonUrl}/complete-loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loanAction),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
