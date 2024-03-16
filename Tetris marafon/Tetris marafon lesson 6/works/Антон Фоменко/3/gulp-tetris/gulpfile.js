

import gulp from "gulp";
import { html } from "./config/gulp-tasks/html.js";
import { css } from "./config/gulp-tasks/css.js";
import { js } from "./config/gulp-tasks/js.js";
import { img } from "./config/gulp-tasks/img.js";
import { fonts } from "./config/gulp-tasks/fonts.js";
import { serve } from "./config/gulp-tasks/serve.js"
import { cleanDist } from "./config/gulp-plugins.js"
import { sounds } from "./config/gulp-tasks/sounds.js";
import { locales } from "./config/gulp-tasks/locales.js";


gulp.task( "build",
    gulp.series(cleanDist, gulp.parallel(html, css, js, img, fonts, sounds, locales), serve),
);