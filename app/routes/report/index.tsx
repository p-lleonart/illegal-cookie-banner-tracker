import { AlertDanger } from "app/components/alert";
import { database } from "app/config/database";
import RootLayout from "app/root";
import { createReport } from "app/services/reports";
import { type Handler, redirect } from "plainweb";
import { z } from "zod";

export const GET: Handler = async ({ req }) => {
  const schema = z.object({ error: z.string() });
  const errorHappened = schema.safeParse(req.query);
  let errTemplate = "";

  // 'success' means that there are an error
  if (errorHappened.success) {
    const errSplitted = errorHappened.data.error.split(",");
    if (errSplitted.includes("website")) {
      errTemplate += "Website URL invalid.";
    }
    if (errSplitted.includes("description")) {
      errTemplate += "Description too short.";
    }
    errTemplate = errTemplate.split(".").join(", ").slice(0, -2);
  }

  return (
    <RootLayout title="Report">
      <div class="p-5">
        <h1 class="text-xl font-bold">Report</h1>
        <div class="m-3">
          {errTemplate ? <AlertDanger title="Error" text={errTemplate} /> : ""}
        </div>

        <form
          action="#"
          method="POST"
          class="shadow-md rounded px-8 pt-6 pb-8 m-2 mt-4 mb-4"
        >
          <div class="mb-4">
            <label class="block font-bold mb-2" for="website">
              Website
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
              id="website"
              type="text"
              placeholder="Website URL"
              name="website"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block font-bold mb-2" for="description">
              Description
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Infraction description"
              name="description"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block font-bold mb-2" for="author">
              Author
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
              id="author"
              type="text"
              placeholder="Your name"
              name="author"
              required
            />
          </div>
          <div class="flex items-center justify-center">
            <button
              class="hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
};

export const POST: Handler = async ({ req }) => {
  const scheme = z.object({
    website: z.string().url(),
    description: z.string().min(10),
    author: z.string(),
  });
  const body = scheme.safeParse(req.body);

  if (!body.data) {
    let errors = "";

    for (const issue of body.error.issues) {
      errors += `${issue.path},`;
    }

    errors = errors.slice(0, -1);
    return redirect(`/report?error=${errors}`);
  }

  const report = await createReport(database, body.data);
  return (
    <RootLayout title={`Report ${report.id}`}>
      <div class="p-5">
        <h1 class="text-xl font-bold">Thanks for your report!</h1>
        <ul>
          <li>
            <a href={`/report/${report.id}`}>Link to access to your report</a>
          </li>
          <li safe>Report ID : {report.id}</li>
          <li safe>Reporter : {report.author}</li>
          <li safe>Website reported : {report.website}</li>
          <li safe>Description : {report.description}</li>
          <li safe>Created on : {new Date(report.created).toLocaleDateString()}</li>
          <li>Processed by admins : {report.completed ? "Yes" : "No"}</li>
        </ul>
      </div>
    </RootLayout>
  );
};
