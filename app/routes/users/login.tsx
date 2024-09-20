import { AlertDanger } from "app/components/alert";
import { database } from "app/config/database";
import RootLayout from "app/root";
import { authUser, createAuthToken, getCurrentUser } from "app/services/auth";
import { type Handler, redirect } from "plainweb";
import z from "zod";

export const GET: Handler = async ({ req }) => {
  const user = await getCurrentUser(database, req);

  if (user) return redirect("/users/dashboard");

  const schema = z.object({ error: z.string() });
  const errorHappened = schema.safeParse(req.query);

  return (
    <RootLayout title="Log in">
      <div class="p-5">
        <h1 class="text-xl font-bold">Log in</h1>

        {errorHappened.data?.error ? (
          <AlertDanger
            title="Error"
            text={
              errorHappened.data.error === "loginRequired"
                ? "Login required"
                : "Invalid email or password"
            }
          />
        ) : (
          ""
        )}

        <form
          action="#"
          method="POST"
          class="shadow-md rounded px-8 pt-6 pb-8 m-2 mt-4 mb-4"
        >
          <div class="mb-4">
            <label class="block font-bold mb-2" for="email">
              Email
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              name="email"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block font-bold mb-2" for="password">
              Password
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 mb-3 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              name="password"
              required
            />
          </div>
          <div class="flex items-center justify-center">
            <button
              class="hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
};

export const POST: Handler = async ({ req, res }) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const body = schema.safeParse(req.body);

  if (!body.success)
    return redirect("/users/login?error=invalidEmailOrPassword");

  const user = await authUser(database, body.data.email, body.data.password);

  if (!user) return redirect("/users/login?error=invalidEmailOrPassword");

  const authToken = await createAuthToken(database, user.id);

  res.cookie("auth_token", authToken.token, {
    expires: new Date(Date.now() + 1800000),
    httpOnly: true,
  });

  return redirect("/users/dashboard");
};
