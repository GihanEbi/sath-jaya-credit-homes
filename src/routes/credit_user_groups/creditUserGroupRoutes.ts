import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api/credit-users/credit-user-groups";
type params = {
  pageNo: number;
  pageSize: number;
};
type searchValue = string | undefined;

type creditUserGroup = {
  leaderID: string;
  memberIDs: string[];
};

type changeLeader = {
  creditUserGroupID: string;
  leaderID: string;
};

type changeStatus = {
  creditUserGroupID: string;
  isActive: boolean;
};

type changeMemberCreditUserGroup = {
  creditUserGroupID: string;
  memberIDs: string[];
};

export async function get_credit_user_groups(
  params: params,
  searchValue: searchValue,
) {
  const queryParams = new URLSearchParams({
    pageNo: params.pageNo.toString(),
    pageSize: params.pageSize.toString(),
  });
  try {
    const res = await fetch(
      `${commonUrl}/get-credit-user-groups?${queryParams.toString()}`,
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

export async function create_credit_user_group(userGroupData: creditUserGroup) {
  try {
    const res = await fetch(`${commonUrl}/add-credit-user-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userGroupData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function edit_credit_user_group(
  userGroupData: creditUserGroup,
  creditUserGroupID: string | null,
) {
  try {
    const queryParams = new URLSearchParams({
      creditUserGroupID: creditUserGroupID?.toString() || "",
    });
    const res = await fetch(
      `${commonUrl}/edit-credit-user-group?${queryParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${getToken()}`, // Uncomment if you need to send a token
        },
        body: JSON.stringify(userGroupData),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function get_credit_user_group_by_id(userGroupID: string | null) {
  const queryParams = new URLSearchParams({
    userGroupID: userGroupID?.toString() || "",
  });
  try {
    const res = await fetch(
      `${commonUrl}/get-credit-user-group-by-id?${queryParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${getToken()}`, // Uncomment if you need to send a token
        },
        body: JSON.stringify({ userGroupID }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function change_leader(userGroupData: changeLeader) {
  try {
    const res = await fetch(`${commonUrl}/change-leader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userGroupData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function change_status(userGroupData: changeStatus) {
  try {
    const res = await fetch(`${commonUrl}/change-credit-user-group-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userGroupData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function change_group_members(
  userGroupData: changeMemberCreditUserGroup,
) {
  try {
    const res = await fetch(`${commonUrl}/change-group-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(userGroupData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}


export async function get_credit_user_groups_without_pagination() {
  try {
    const res = await fetch(
      `${commonUrl}/get-credit-user-groups-without-pagination`,
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