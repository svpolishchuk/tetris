import gulp from "gulp";
import changed from "gulp-changed"; // визначає чи змінилися файли в потоці
import plumber from "gulp-plumber"; // запобігайте розриву каналу через помилки плагінів gulp
import imagemin from "gulp-imagemin";
import { plumberNotify } from "./../gulp-plugins.js";
import environments from "gulp-environments";
import webp from "gulp-webp";

const { development, production } = environments;

const SOURCE = ["./src/img/**/*"];
let destination = null;

development() ? (destination = "dev/img") : (destination = "dist/img");

function img() {
    return gulp
        .src(SOURCE)
        .pipe(changed(destination))
        .pipe(webp())
        .pipe(gulp.dest(destination))

        .pipe(gulp.src(SOURCE))
        .pipe(changed(destination))
        .pipe(plumber(plumberNotify("IMG")))
        .pipe(production(imagemin()))
        .pipe(gulp.dest(destination));
}

export { img };
