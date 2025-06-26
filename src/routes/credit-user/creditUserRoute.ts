import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api/credit-users";
type params = {
  pageNo: number;
  pageSize: number;
};
type searchValue = string | undefined;

type User = {
  creditUserID?: string;
  fullName: string;
  gender: string;
  birthday: string;
  permanentAddress: string;
  phoneNo: string;
  address: string;
  nic: string;
  maritalState: string;
  email: string;
  profilePicture: string;
  nicFrontPicture: string;
  nicBackPicture: string;
  locationCertificationPicture: string;
};

type UserActions = {
  creditUserID: string;
  newStatus: boolean;
};

export async function get_credit_users(
  params: params,
  searchValue: searchValue,
) {
  const queryParams = new URLSearchParams({
    pageNo: params.pageNo.toString(),
    pageSize: params.pageSize.toString(),
  });

  try {
    const res = await fetch(
      `${commonUrl}/get-credit-users?${queryParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${getToken()}`, // Uncomment if you need to send a token
        },
        body: JSON.stringify({ searchValue }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function create_credit_user(userData: User) {
  try {
    const res = await fetch(`${commonUrl}/add-credit-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function get_credit_user_by_id(userID: string | null) {
  
  const queryParams = new URLSearchParams({
    userID: userID?.toString() || "",
  });
  try {
    const res = await fetch(`${commonUrl}/get-credit-user-by-id?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify({ userID }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function edit_credit_user(userData: User, userID: string | null) {
  try {
    const queryParams = new URLSearchParams({
      creditUserID: userID?.toString() || "",
    });
    const res = await fetch(`${commonUrl}/edit-credit-user?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function change_status(userData: UserActions) {
  try {
    const res = await fetch(`${commonUrl}/change-credit-user-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function get_credit_users_without_pagination() {
  try {
    const res = await fetch(
      `${commonUrl}/get-credit-users-without-pagination`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${getToken()}`, // Uncomment if you need to send a token
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
