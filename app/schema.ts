import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const authTokens = sqliteTable("auth_tokens", {
  identifier: text("identifier").notNull().primaryKey(),
  token: text("token").notNull(),
  expires: int("expires").notNull(),
  created: int("created").notNull(),
});

export type AuthToken = typeof authTokens.$inferSelect;

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  created: int("created").notNull(),
});

export type User = typeof users.$inferSelect;

export const reports = sqliteTable("reports", {
  id: text("id").notNull().primaryKey(),
  /**
   * Website's link
   */
  website: text("website").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  created: int("created").notNull(),
  completed: int("completed", { mode: "boolean" }),
});

export type Report = typeof reports.$inferSelect;
