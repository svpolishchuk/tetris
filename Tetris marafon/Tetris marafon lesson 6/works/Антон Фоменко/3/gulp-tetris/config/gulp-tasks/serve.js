
import environments from "gulp-environments";

import gulp from 'gulp';
import { html } from './html.js';
import { css } from './css.js';
import { js } from './js.js';
import { img } from './img.js';
import { fonts } from './fonts.js';
import { sounds } from './sounds.js';
import { locales } from './locales.js';
import browserSync from 'browser-sync';


const { development, production } = environments;

const SOURCE = "./src/>aaaaa</**/*";
let destination = null;

development() ? destination = "./dev" : destination = "./dist";

const server = browserSync.create();

function serve() {
    server.init({
        server: {
            baseDir: destination
        }
    });

    gulp.watch('src/html/**/*.html', html);
    gulp.watch('src/scss/**/*.scss', css);
    gulp.watch('src/js/**/*.js', js);
    gulp.watch('src/img/**/*', img);
    gulp.watch('src/fonts/**/*', fonts);
    gulp.watch('src/sounds/**/*', sounds);
    gulp.watch('src/locales/**/*', locales);
    gulp.watch(`${destination}/**/*`).on('change', server.reload);
}

export { serve };
