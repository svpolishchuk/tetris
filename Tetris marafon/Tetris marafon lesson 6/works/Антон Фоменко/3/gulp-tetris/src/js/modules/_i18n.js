import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

console.log("i18n");

const GAME_LANGUES = document.querySelector(".header__game-lang").children;

function applyTranslation() {
    console.log("applyTranslation");
    document.querySelector(".display__pause-title").innerHTML = i18next.t("pause-title");
    document.querySelector(".display__game-over-title").innerHTML = i18next.t("game-over-title");

    document.querySelector(".game-statistics__max").innerHTML = i18next.t("max");
    document.querySelector(".game-statistics__cleans").innerHTML = i18next.t("cleans");
    document.querySelector(".game-statistics__lvl").innerHTML = i18next.t("lvl");
    document.querySelector(".game-statistics__next").innerHTML = i18next.t("next");
    document.querySelector(".game-statistics__time").innerHTML = i18next.t("time");

    document.querySelector(".footer__developer").innerHTML = i18next.t("developer");
    document.querySelector(".footer__powered-by").innerHTML = i18next.t("poweredBy");
    document.querySelector(".footer__slogan").innerHTML = i18next.t("slogan");
}

i18next
    .use(Backend)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "./../../locales/{{lng}}/translation.json",
        },
    })
    .then(function (t) {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage) {
            i18next.changeLanguage(savedLanguage);
        }

        applyTranslation();

    });

for (const gameLanguage of GAME_LANGUES) {
    gameLanguage.addEventListener("click", function () {
        const language = gameLanguage.dataset.lang;
        i18next.changeLanguage(language, (err, t) => {
            if (err) return console.log('something went wrong loading', err);
            localStorage.setItem("language", language);
            applyTranslation();
        });
    });
}
