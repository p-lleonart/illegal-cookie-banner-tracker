import type { Database } from "app/config/database";
import { reports } from "app/schema";
import { eq } from "drizzle-orm";
import { randomId } from "plainweb";

export async function createReport(
  db: Database,
  report: { website: string; description: string; author: string },
) {
  const created = {
    id: randomId("rpt"),
    website: report.website,
    description: report.description,
    author: report.author,
    created: Date.now(),
    completed: false,
  };
  await db.insert(reports).values(created);
  return created;
}

export async function getReport(db: Database, id: string) {
  const report = await db.query.reports.findFirst({
    where: eq(reports.id, id),
  });

  if (!report) return undefined;

  return report;
}

export async function getReports(db: Database) {
  return await db.query.reports.findMany();
}
