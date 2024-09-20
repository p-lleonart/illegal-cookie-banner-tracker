const cookieBanner = document.querySelector("#cookie_banner");
const gotItBtn = document.querySelector("#cookie_banner_got_it");
const moreInfosBtn = document.querySelector("#cookie_banner_more_infos");
const cookieList = document.querySelector("#cookie_banner_details");
const cookie = localStorage.getItem("cookie_banner_accepted");

if (!cookie) {
  cookieBanner.classList.remove("hidden");
}

gotItBtn.addEventListener("click", () => {
  localStorage.setItem("cookie_banner_accepted", true);
  cookieBanner.classList.add("hidden");
});

moreInfosBtn.addEventListener("click", () => {
  cookieList.classList.toggle("hidden");
});
