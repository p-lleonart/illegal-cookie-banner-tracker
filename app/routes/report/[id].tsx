import { database } from "app/config/database";
import RootLayout from "app/root";
import { reports } from "app/schema";
import { getCurrentUser } from "app/services/auth";
import { getReport } from "app/services/reports";
import { eq } from "drizzle-orm";
import { type Handler, notFound, redirect } from "plainweb";

export const GET: Handler = async ({ req }) => {
  const user = await getCurrentUser(database, req);

  const report = await getReport(database, req.params.id);

  if (!report) return notFound();

  return (
    <RootLayout title={`Report ${report.id}`}>
      <div class="p-5">
        <div class="flex content-center gap-1 shrink-0 mb-2">
          <h1 class="text-xxl font-bold mb-3" safe>
            Report {report.id}
          </h1>
          <a
            href={report.website}
            class="ml-auto hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            rel="noreferrer noopener noreferer"
            target="_blank"
          >
            Visit site
          </a>
        </div>
        <ul>
          <li safe>Report ID : {report.id}</li>
          <li safe>Reporter : {report.author}</li>
          <li safe>Website reported : {report.website}</li>
          <li safe>Description : {report.description}</li>
          <li safe>Created on : {new Date(report.created).toLocaleDateString()}</li>
          <li>Handled by admins : {report.completed ? "Yes" : "No"}</li>
          {user ? (
            <form action="#" method="POST">
              <button type="submit">
                {report.completed ? "Uncheck" : "Check"}
              </button>
            </form>
          ) : (
            ""
          )}
        </ul>
      </div>
    </RootLayout>
  );
};

export const POST: Handler = async ({ req }) => {
  const user = await getCurrentUser(database, req);

  if (!user) return redirect("/users/logout");

  const report = await getReport(database, req.params.id);

  if (!report) return notFound();

  await database
    .update(reports)
    .set({ completed: !report.completed })
    .where(eq(reports.id, report.id));

  return redirect(`/report/${req.params.id}`);
};
