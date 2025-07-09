import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api/group_rules";

type params = {
  pageNo: number;
  pageSize: number;
};
type searchValue = string | undefined;

type GroupRule = {
  ID: string;
  name: string;
  description: string;
};

type assignRule = {
  groupID: string;
  newList: string[];
  deleteList: string[];
};

export async function create_group_rule(groupRuleData: GroupRule) {
  try {
    const res = await fetch(`${commonUrl}/add_group_rule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(groupRuleData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function assign_group_rule(assignRuleData: assignRule) {
  try {
    const res = await fetch(`${commonUrl}/assign_rules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(assignRuleData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function get_all_group_rule(
  params: params,
  searchValue: searchValue,
) {
  const queryParams = new URLSearchParams({
    pageNo: params.pageNo.toString(),
    pageSize: params.pageSize.toString(),
  });
  try {
    const res = await fetch(
      `${commonUrl}/get_all_group_rules?${queryParams.toString()}`,
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
