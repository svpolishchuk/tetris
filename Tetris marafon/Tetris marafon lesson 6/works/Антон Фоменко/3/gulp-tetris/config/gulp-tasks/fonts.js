import gulp from "gulp";
import changed from "gulp-changed"; // запобігайте розриву каналу через помилки плагінів gulp
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import environments from "gulp-environments";

const { development, production } = environments;

const SOURCE = ["./src/fonts/**/*.ttf"];
let destination  = null;

development() ? destination = "dev/fonts" : destination = "dist/fonts";

function fonts () {
    return gulp
        .src( SOURCE )
        .pipe(changed( destination ))
        .pipe(ttf2woff())
        .pipe(gulp.dest( destination ))

        .pipe(gulp.src( SOURCE ))
        .pipe(ttf2woff2())
        .pipe(gulp.dest( destination ))

        .pipe(gulp.src("./src/fonts/**/*"))
        .pipe(gulp.dest( destination ));
}


export { fonts };