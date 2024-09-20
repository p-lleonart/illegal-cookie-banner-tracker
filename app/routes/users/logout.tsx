import { type Handler, redirect } from "plainweb";

export const GET: Handler = async ({ res }) => {
  res.clearCookie("auth_token");
  return redirect("/users/login?error=loginRequired");
};
