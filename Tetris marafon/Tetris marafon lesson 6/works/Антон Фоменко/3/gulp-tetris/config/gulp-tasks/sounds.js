import gulp from "gulp";
import changed from 'gulp-changed'; // визначає чи змінилися файли в потоці
import plumber from "gulp-plumber"; // запобігайте розриву каналу через помилки плагінів gulp
import { plumberNotify } from "./../gulp-plugins.js";
import environments from "gulp-environments";
const { development, production } = environments;

const SOURCE = "./src/sounds/**/*";
let destination  = null;

development() ? destination = "dev/sounds" : destination = "dist/sounds";

function sounds() {
    return gulp
        .src( SOURCE )
        .pipe(changed( destination ))
        .pipe(plumber(plumberNotify("SOUNDS")))
        .pipe(gulp.dest( destination ));
}

export { sounds };