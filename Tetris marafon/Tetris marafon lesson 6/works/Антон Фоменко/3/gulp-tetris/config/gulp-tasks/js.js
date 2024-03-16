import gulp from "gulp";
import changed from "gulp-changed"; // визначає чи змінилися файли в потоці
import plumber from "gulp-plumber"; // запобігайте розриву каналу через помилки плагінів gulp
import { plumberNotify } from "./../gulp-plugins.js";
import environments from "gulp-environments";
import babel from "gulp-babel";
import webpack from "webpack-stream";
import { webpackConfig } from "./../../webpack.config.js";

const { development, production } = environments;

const SOURCE = ["./src/js/**/*.js"];
let destination  = null;

development() ? destination = "dev/js" : destination = "dist/js";

function js() {
    return gulp
        .src(SOURCE)
        .pipe(changed( destination ))
        .pipe(plumber(plumberNotify("JavaScript")))
        .pipe(production(babel()))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest( destination ));
}

export { js };
