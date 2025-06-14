import { getToken } from "@/utils/auth-utils";

const commonUrl = "/api/users/user-groups";
type params = {
  pageNo: number;
  pageSize: number;
};
type searchValue = string | undefined;

export async function get_user_groups(
  params: params,
  searchValue: searchValue,
) {
  const queryParams = new URLSearchParams({
    pageNo: params.pageNo.toString(),
    pageSize: params.pageSize.toString(),
  });
  try {
    const res = await fetch(`${commonUrl}/get-user-group?${queryParams.toString()}`, {
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
