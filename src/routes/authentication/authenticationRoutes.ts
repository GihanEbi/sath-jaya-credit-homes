const commonUrl = "/api/credit-users/credit-user-groups";

type login = {
  email: string;
  password: string;
};

export async function create_credit_user_group(loginData: login) {
  try {
    const res = await fetch(`${commonUrl}/add-credit-user-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // token: `${getToken()}`, // Uncomment if you need to send a token
      },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
