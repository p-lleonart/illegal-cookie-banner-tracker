import type { Database } from "app/config/database";
import { env } from "app/config/env";
import { authTokens } from "app/schema";
import { getUser } from "app/services/users";
import { compareSync } from "bcrypt";
import { eq } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";

function generateAccessToken(id: string) {
  return sign({ id: id }, env.SECRET_KEY, { expiresIn: "1800000" });
}

export async function createAuthToken(db: Database, id: string) {
  if (
    await db.query.authTokens.findFirst({
      where: eq(authTokens.identifier, id),
    })
  )
    await deleteAuthToken(db, id);

  const created = {
    identifier: id,
    token: generateAccessToken(id),
    expires: Date.now() + 1800000,
    created: Date.now(),
  };
  await db.insert(authTokens).values(created);
  return created;
}

export async function authenticateToken(db: Database, token: string) {
  const id: string = await new Promise((resolve) => {
    verify(token, env.SECRET_KEY, async (err: any, data: any) => {
      if (err) resolve(`error_${err.message}`);

      try {
        resolve(data.id);
      } catch (err) {
        resolve("error_invalidToken");
      }
    });
  });

  if (id.startsWith("error_")) {
    await db.delete(authTokens).where(eq(authTokens.token, token));
    return null;
  }

  const authToken = await db.query.authTokens.findFirst({
    where: eq(authTokens.identifier, id),
  });

  if (!authToken) return null;

  if (authToken.expires < Date.now()) {
    await deleteAuthToken(db, authToken.identifier);
    return null;
  }

  return await getUser(db, id);
}

export async function deleteAuthToken(db: Database, id: string) {
  await db.delete(authTokens).where(eq(authTokens.identifier, id));
}

export async function authUser(db: Database, email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (user) => eq(user.email, email),
  });
  if (!user) throw new Error("User doesn't exist");

  if (user.password) {
    // TODO: remake all migrations with .notNull() for all user table fields
    const doesPasswordsMatch = compareSync(password, user.password);

    if (doesPasswordsMatch) return user;
  }

  return undefined;
}

export async function getCurrentUser(db: Database, req: any) {
  const cookies = req.headers.cookie?.split(";");
  if (cookies) {
    const token = cookies
      .find((cookie: string) => cookie.startsWith("auth_token"))
      ?.slice(11);

    if (token) {
      return await authenticateToken(db, token);
    }
    return undefined;
  }
  return undefined;
}
