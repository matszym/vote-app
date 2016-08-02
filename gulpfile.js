const gulp = require('gulp'),
sourcemaps = require('gulp-sourcemaps'),
concat = require('gulp-concat'),
babel = require('gulp-babel'),

paths = {
  jsFiles: [
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
