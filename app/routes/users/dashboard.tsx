import { database } from "app/config/database";
import RootLayout from "app/root";
import { getCurrentUser } from "app/services/auth";
import { getReports } from "app/services/reports";
import { type Handler, redirect } from "plainweb";

export const GET: Handler = async ({ req }) => {
  const user = await getCurrentUser(database, req);

  if (!user) return redirect("/users/logout");

  const reports = await getReports(database);

  return (
    <RootLayout title={`Dashboard - ${user.name}`}>
      <div class="p-5">
        <div class="flex content-center gap-1 shrink-0 mb-2">
          <h1 class="text-xxl font-bold mb-3" safe>
            Hi, {user.name}!
          </h1>
          <a
            href="/users/logout"
            class="ml-auto bg-red-500 hover:bg-red-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white hover:text-white"
          >
            Log out
          </a>
        </div>
        <table class="table-auto">
          <tr>
            <th class="p-2">Website reported</th>
            <th class="p-2">Report date</th>
            <th class="p-2">Processed</th>
          </tr>
          {reports.map((report) => (
            <tr>
              <td class="p-2" safe>
                {report.website}
              </td>
              <td class="p-2" safe>
                {new Date(report.created).toLocaleDateString()}
              </td>
              <td class="p-2">{report.completed ? "Yes" : "No"}</td>
              <td class="p-2">
                <a href={`/report/${report.id}`}>View</a>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </RootLayout>
  );
};
