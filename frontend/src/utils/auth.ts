const AUTH_KEY = "bsu-admin-auth";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function loginAdmin(username: string, password: string): boolean {
  const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (ok) {
    localStorage.setItem(AUTH_KEY, "true");
  }
  return ok;
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
}

