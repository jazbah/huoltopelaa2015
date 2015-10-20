var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var pngcrush = require('imagemin-pngcrush');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');

// Concaténation et minification JS, en lisant la map.json
gulp.task('js', function () {
  var map = require('./js/map.json'), list = [];
  for (var i in map) {
    if (map.hasOwnProperty(i) && map[i]) {
      // Make relative to drupal path
      list.push('../../../../' + i);
    }
  }
  return gulp.src(list)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

// Vérification de la syntaxe JS
gulp.task('jshint', function () {
  return gulp.src([
    './js/*.js',
    //'../../modules/**/*.js',
    '!./js/xt*.js',
    '!./js/switchery.js',
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Compilation LESS en CSS
gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

// Optimisation des images
gulp.task('images', function () {
  return gulp.src('./img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('img'));
});

// Sprite et minification SVG
gulp.task('svg', function () {
  return gulp.src('./svg/*.svg')
    .pipe(svgmin([{
      collapseGroups:false
    }]))
    .pipe(svgstore({
      fileName: 'icons.svg',
      prefix: 'icon-',
      inlineSvg: true
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('default', ['sass', 'jshint', 'js', 'images', 'svg']);

gulp.task('watch', function () {
  gulp.watch(['./js/*.js', '../../modules/**/*.js'], ['js', 'jshint']);
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./img/*', ['images']);
  gulp.watch('./svg/*', ['svg']);
});