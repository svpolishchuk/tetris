import gulp from 'gulp';
import clean from 'gulp-clean';
import notify from "gulp-notify"; // дозволяє створювати сповіщення в процесі роботи Gulp
import environments from "gulp-environments";

const { development, production } = environments;

let destination = null;

development() ? destination = "dev" : destination = "dist";

function cleanDist() {
    return gulp
        .src(destination, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
}

const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: "Error <%= error.message %>",
            sound: false,
        }),
    };
};

export { cleanDist, plumberNotify };