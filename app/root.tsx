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
        <body class="relative min-h-screen">
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

        <div
          id="cookie_banner"
          class="absolute left-2 right-2 bottom-2 hidden p-3 bg-white rounded-lg shadow-lg"
        >
          <h3 class="mb-2 text-2xl font-bold">Cookies</h3>
          <p>
            This site uses cookies to operate properly (authentication for the
            administration panel).
          </p>
          <ul id="cookie_banner_details" class="hidden">
            <p class="mb-1">We use this cookies:</p>
            <li class="flex items-center pl-2 mb-1">
              <pre>cookie_banner_accepted</pre>: let the site know if you
              already seen the banner. Actually, it's in the{" "}
              <pre>localStorage</pre>.
            </li>
            <li class="flex items-center pl-2 mb-1">
              <pre>access_token</pre>: authenticates the user if he is logged
              in.
            </li>
          </ul>
          <div class="flex gap-3">
            <button
              id="cookie_banner_got_it"
              class="hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Got it
            </button>
            <button
              id="cookie_banner_more_infos"
              class="hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              More informations
            </button>
          </div>
        </div>
        
        <script type="text/javascript" src="/public/cbanner.js"></script>
      </html>
    </>
  );
}
