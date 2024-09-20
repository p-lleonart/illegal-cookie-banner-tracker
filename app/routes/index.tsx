import RootLayout from "app/root";
import type { Handler } from "plainweb";

export const GET: Handler = async () => {
  return (
    <RootLayout title="Home">
      <div class="p-5">
        <h1 class="text-xl font-bold">
          Report illegal cookie banners on this site!
        </h1>
        <a href="/report">Report</a>
      </div>
    </RootLayout>
  );
};
