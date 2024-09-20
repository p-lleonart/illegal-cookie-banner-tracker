import RootLayout from "app/root";
import type { Handler } from "plainweb";

export const GET: Handler = async () => {
  return (
    <RootLayout title="Home">
      <div class="p-5 text-center">
        <h1 class="text-3xl font-bold mb-4">
          Report illegal cookie banners on this site!
        </h1>
        <a
          href="/report"
          class="hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Report
        </a>
        <blockquote class="twitter-tweet">
          <p lang="fr" dir="ltr">
            Les bandeaux cookie c&#39;est aussi une vaste blague : la loi dit
            que &quot;oui&quot; et &quot;non&quot; doivent avoir le même poids,
            et toi tu cherches le lien &quot;continuer sans accepter&quot; qui
            est sur fond transparent en police 8px, parfois en haut, en bas, au
            milieu du texte... Et ensuite tu te prends…
          </p>
          &mdash; Didier Sampaolo (@dsampaolo)
          <a href="https://twitter.com/dsampaolo/status/1835578472099385680?ref_src=twsrc%5Etfw">
            September 16, 2024
          </a>
        </blockquote>
        {/* <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script> */}
      </div>
    </RootLayout>
  );
};
