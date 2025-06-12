export function saveToken(token: string) {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.log(error);
  }
}

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
