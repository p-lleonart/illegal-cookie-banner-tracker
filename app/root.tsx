import Html from "@kitajs/html";

export default function RootLayout(
  props: Html.PropsWithChildren<{
    head?: string | Promise<string>;
    description?: string;
    title?: string;
  }>,
) {
  return (
    <>
      {"<!doctype html>"}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{props.title ?? "page"} | Illegal cookie banner tracker</title>
          <meta
            name="description"
            content={
              props.description ||
              "This is a website that aims to track the websites with illegal cookie banners."
            }
          />
          <link rel="stylesheet" href="/public/output.css" />
          {props.head ? Html.escapeHtml(props.head) : null}
        </head>
        <body>
          <nav class="flex content-center gap-1 shrink-0 p-3">
            <a href="/">ICB tracker</a>
            <a href="/report" class="ml-auto">
              Report
            </a>
            <a href="/users/dashboard">Panel</a>
          </nav>
          {props.children}
          <footer class="p-3">
            <p>
              Made by <a href="https://github.com/p-lleonart">p-lleonart</a>.
              Source code available on{" "}
              <a href="https://github.com/p-lleonart/illegal-cookie-banner-tracker">
                GitHub
              </a>
              . Made with <a href="https://plainweb.dev">plainweb.dev</a>
            </p>
          </footer>
        </body>
      </html>
    </>
  );
}
