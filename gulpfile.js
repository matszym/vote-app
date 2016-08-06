const gulp = require('gulp'),
sourcemaps = require('gulp-sourcemaps'),
concat = require('gulp-concat'),
babel = require('gulp-babel'),
browserSync = require('browser-sync');

paths = {
  jsFiles: [
    'client/**/*module.js',
    'client/*.js',
    'client/**/*.js']
};

gulp.task('javascript', () => {
  return gulp.src(paths.jsFiles)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(concat('vote-app.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('public'));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    open: 'external',
    host: '127.0.0.1',
    port: '9000',
    proxy: 'http://127.0.0.1:9000'
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.jsFiles, ['javascript', 'browser-sync']);
});

gulp.task('default', ['javascript', 'watch', 'browser-sync']);
