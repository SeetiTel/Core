var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');

//lint it out
gulp.task('hint', function() {
  gulp.src(['./src/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

//minify and concat our js
gulp.task('js', function() {
  gulp.src(['./src/app.js'])
    .pipe(uglify())
    .pipe(concat('index.js'))
    .pipe(gulp.dest('.'));
});

//tie it all together
gulp.task('default', ['js', 'hint']);

//realtime watching
gulp.task('realtime', function() {
  gulp.watch('./src/**/*', ['js']);
});

gulp.task('watch', ['realtime', 'js']);
