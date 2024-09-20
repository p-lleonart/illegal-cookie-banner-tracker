import { AlertDanger } from "app/components/alert";
import { database } from "app/config/database";
import RootLayout from "app/root";
import { createAuthToken, getCurrentUser } from "app/services/auth";
import { createUser } from "app/services/users";
import { type Handler, redirect } from "plainweb";
import z from "zod";

export const GET: Handler = async ({ req }) => {
  const user = await getCurrentUser(database, req);

  if (user) return redirect("/users/dashboard");

  const schema = z.object({ error: z.string() });
  const errorHappened = schema.safeParse(req.query);
  let errorTemplate = "";

  // here "success" is when an error is catched
  if (errorHappened.success) {
    const errorHappenedSplitted = errorHappened.data.error.split(",");

    if (errorHappened.data.error === "emailAlreadyUsed") {
      errorTemplate += "Email already used.";
    }
    if (errorHappenedSplitted.includes("password")) {
      errorTemplate += "Password too short.";
    }
    if (errorHappenedSplitted.includes("email")) {
      errorTemplate += "Invalid email.";
    }
    if (errorTemplate === "") {
      errorTemplate += "Unknown Error.";
    }
  }

  errorTemplate = errorTemplate.split(".").join(", ").slice(0, -2);

  return (
    <RootLayout title="Sign up">
      <div class="p-5">
        <h1 class="text-xl font-bold">Sign up</h1>

        {errorTemplate ? (
          <AlertDanger title="Error" text={errorTemplate} />
        ) : (
          ""
        )}

        <form
          action="#"
          method="POST"
          class="shadow-md rounded px-8 pt-6 pb-8 m-2 mt-4 mb-4"
        >
          <div class="mb-4">
            <label class="block font-bold mb-2" for="name">
              Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              required
            />
          </div>
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
          <div class="mb-4">
            <label class="block font-bold mb-2" for="password">
              Password
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
};

export const POST: Handler = async ({ req, res }) => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });
  const body = schema.safeParse(req.body);

  if (!body.data) {
    let errors = "";

    for (const issue of body.error.issues) {
      errors += `${issue.path},`;
    }
    errors = errors.slice(0, -1); // remove the useless comma at the end

    return redirect(`/users/signup?error=${errors}`);
  }

  const user = await createUser(database, body.data);
  if (user === "User already exists")
    return redirect("/users/signup?error=emailAlreadyUsed");

  const authToken = await createAuthToken(database, user.id);

  res.cookie("auth_token", authToken.token, {
    expires: new Date(Date.now() + 1800000),
    httpOnly: true,
  });

  return redirect("/users/dashboard");
};
