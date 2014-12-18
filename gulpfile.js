/* Source and destination paths */
var paths = {
  css: { src: './src/css/', dest: './dist/' },
  js: { src: './src/js/', dest: './dist/' },
  examples: { src: './examples/', dest: './dist/examples/' },
  bower: { src: './bower_components/' }
};

/* Files */
var files = {
  css: { src: paths.css.src + '**/*.styl' },
  js: { src: paths.js.src + '**/*.js', dest: 'simply.js' },
  examples: { src: [paths.examples.src + '**/*.styl', paths.examples.src + '**/*.js', paths.examples.src + '**/*.html'] }
};

/* Plugins */
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  del = require('del'),
  rename = require('gulp-rename'),
  gzip = require('gulp-gzip'),

  /* CSS */
  stylus = require('gulp-stylus'),
  postcss = require('gulp-postcss'),
  postcssProcessors = [require('autoprefixer-core')],
  minifyCSS = require('gulp-minify-css'),

  /* Javascript */
  concat = require('gulp-concat'),
  insert = require('gulp-insert'),
  uglify = require('gulp-uglify');

/* Tasks */
gulp.task('watch', ['build'], function() {
  gulp.watch(files.css.src, ['css']);
  gulp.watch(files.js.src, ['js']);
  gulp.watch(files.examples.src, ['examples']);
});

gulp.task('compress', function() {
  gulp.src(paths.css.dest + '*.css')
    .pipe(gzip())
    .pipe(gulp.dest(paths.css.dest));
  gulp.src(paths.js.dest + '*.js')
    .pipe(gzip())
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('clean', function() {
  del([paths.css.dest, paths.js.dest, paths.examples.dest]);
});

gulp.task('css', function() {
  gulp.src(paths.css.src + '*.styl')
    .pipe(plumber({ errorHandler: notify.onError({ title: 'CSS Error', message: '<%= error.message %>' }) }))
    .pipe(stylus({ 'include css': true }))
    .pipe(postcss(postcssProcessors))
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(notify({ title: 'CSS Compiled', message: 'Success', onLast: true }));
});

gulp.task('js', function() {
  gulp.src([
    paths.bower.src + 'riotjs/lib/observable.js',
    paths.js.src + 'lib/*.js',
    paths.js.src + '*.js'
  ])
    .pipe(plumber({ errorHandler: notify.onError({ title: 'Javascript Error', message: '<%= error.message %>' }) }))
    .pipe(concat(files.js.dest))
    .pipe(insert.wrap('(function(Simply, window, document, riot) { "use strict";', 'window.simply = Simply; }({}, window, document, {}));'))
    .pipe(uglify(
      { mangle: false, compress: false, output: { beautify: true } }
    ))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(notify({ title: 'Javascript Compiled', message: 'Success', onLast: true }));
});

gulp.task('examples', function() {
  gulp.src(paths.examples.src + '**/*.styl')
    .pipe(plumber({ errorHandler: notify.onError({ title: 'CSS Error', message: '<%= error.message %>' }) }))
    .pipe(stylus({ 'include css': true }))
    .pipe(postcss(postcssProcessors))
    .pipe(gulp.dest(paths.examples.dest))
    .pipe(notify({ title: 'Example CSS Compiled', message: 'Success', onLast: true }));

  gulp.src(paths.examples.src + '**/*.js')
    .pipe(plumber({ errorHandler: notify.onError({ title: 'Javascript Error', message: '<%= error.message %>' }) }))
    .pipe(uglify({ mangle: false, compress: false, output: { beautify: true } }))
    .pipe(gulp.dest(paths.examples.dest))
    .pipe(notify({ title: 'Example Javascript Compiled', message: 'Success', onLast: true }));

  gulp.src(paths.examples.src + '**/*.html')
    .pipe(plumber({ errorHandler: notify.onError({ title: 'Javascript Error', message: '<%= error.message %>' }) }))
    .pipe(gulp.dest(paths.examples.dest))
    .pipe(notify({ title: 'Example HTML Compiled', message: 'Success', onLast: true }));
});

gulp.task('build', ['css', 'js', 'examples']);
gulp.task('default', ['watch']);
