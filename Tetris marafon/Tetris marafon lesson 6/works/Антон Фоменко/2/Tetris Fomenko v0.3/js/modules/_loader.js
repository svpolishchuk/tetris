import { LOADER } from "./../constants/_constants.js";

document.body.style.overflow = "hidden";

window.addEventListener("load", () => {
    let rects = LOADER.querySelectorAll(".loader__rect");
    rects.forEach((element) => {
        element.style.animationPlayState = "paused";
    });
    LOADER.style.visibility = "hidden";
    document.body.style.overflow = "visible";
});
