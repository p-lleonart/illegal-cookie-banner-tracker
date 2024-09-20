import type { Database } from "app/config/database";
import { users } from "app/schema";
import { genSaltSync, hashSync } from "bcrypt";
import { eq } from "drizzle-orm";
import { randomId } from "plainweb";

const saltRounds = 10;

export async function createUser(
  db: Database,
  user: { name: string; email: string; password: string },
) {
  if (
    await db.query.users.findFirst({
      where: eq(users.email, user.email),
    })
  )
    return "User already exists";

  /**
   * password hashing
   */
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(user.password, salt);

  const created = {
    id: randomId("usr"),
    name: user.name,
    email: user.email,
    created: Date.now(),
    password: hash,
  };
  await db.insert(users).values(created);
  return created;
}

export async function getUser(db: Database, id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}
