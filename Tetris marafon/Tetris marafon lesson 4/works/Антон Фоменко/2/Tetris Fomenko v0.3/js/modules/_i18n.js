import i18next from 'https://cdn.jsdelivr.net/npm/i18next@23.10.0/+esm';
import Backend from "https://cdn.jsdelivr.net/npm/i18next-http-backend@2.5.0/+esm";
import LanguageDetector from "https://cdn.jsdelivr.net/npm/i18next-browser-languagedetector@7.2.0/+esm";

const GAME_LANGUES = document.querySelector(".header__game-lang").children;

i18next
    .use(Backend)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        // debug: true,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "./../../locales/{{lng}}/translation.json",
        },
}).then(function(t) {

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        i18next.changeLanguage(savedLanguage);
    }

    document.querySelector(".display__pause-title").innerHTML = i18next.t("pause-title");

    document.querySelector(".game-statistics__max").innerHTML = i18next.t("max");
    document.querySelector(".game-statistics__cleans").innerHTML = i18next.t("cleans");
    document.querySelector(".game-statistics__lvl").innerHTML = i18next.t("lvl");
    document.querySelector(".game-statistics__next").innerHTML = i18next.t("next");
    document.querySelector(".game-statistics__time").innerHTML = i18next.t("time");

    document.querySelector(".footer__developer").innerHTML = i18next.t("developer");
    document.querySelector(".footer__powered-by").innerHTML = i18next.t("poweredBy");
    document.querySelector(".footer__slogan").innerHTML = i18next.t("slogan");

});

for (let i = 0; i < GAME_LANGUES.length; i++) {
    const gameLanguage = GAME_LANGUES[i];
    gameLanguage.addEventListener('click', function() {
        const language = gameLanguage.dataset.lang;
        i18next.changeLanguage(language);
        localStorage.setItem("language", language);
        location.reload();
    });
}



/* i18next.init({
    lng: gameLanguage,
    debug: true,
    resources: {
        en: {
            translation: {
                "max": "Max",
                "cleans": "Cleans",
                "lvl": "Level",
                "next": "Next",
                "time": "Time",
                "developer": `Developed by Fomenko Anton on the course "Let's develop a Tetris game" by Vitaly Mazyar.`,
                "poweredBy": "Powered by ITVDN and CyberBionic Systematics.",
                "slogan": "Everything in JavaScript is kefir!",
            }
        },
        uk: {
            translation: {
                "max": "Максимум",
                "cleans": "Очищено",
                "lvl": "Рівень",
                "next": "Наступна",
                "time": "Час",
                "developer": `Розробив Фоменко Антон на курсі "Пишемо гру Тетріс" Віталія Мазяра.`,
                "poweredBy": "За підтримки ITVDN та CyberBionic Systematics.",
                "slogan": "Все в JavaScript - це кефір!",
            }
        },
    },
});

document.querySelector(".game-statistics__max").innerHTML = i18next.t("max");
document.querySelector(".game-statistics__cleans").innerHTML = i18next.t("cleans");
document.querySelector(".game-statistics__lvl").innerHTML = i18next.t("lvl");
document.querySelector(".game-statistics__next").innerHTML = i18next.t("next");
document.querySelector(".game-statistics__time").innerHTML = i18next.t("time");

document.querySelector(".footer__developer").innerHTML = i18next.t("developer");
document.querySelector(".footer__powered-by").innerHTML = i18next.t("poweredBy");
document.querySelector(".footer__slogan").innerHTML = i18next.t("slogan");
 */