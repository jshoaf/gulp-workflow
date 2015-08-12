var gulp = require('gulp'),
  gutil = require('gulp-util'),
  coffee = require('gulp-coffee'),
  browserify = require('gulp-browserify'),
  compass = require('gulp-compass'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat');

var env,
  coffeeSources,
  jsSources,
  sassSources,
  htmlSources,
  jsonSources,
  outputDir,
  sassStyle;

// To use, set the variable from the command line as shown:
//   set NODE_ENV=production
env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  outputDir = 'builds/development/'
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/'
  sassStyle = 'compressed';
}

console.log("[ENVIRONMENT MODE]: " + env);
console.log("[outputDir]: " + outputDir);
console.log("[sassStyle]: " + sassStyle);

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('log', function() {
  gutil.log('workflows are awesome');
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle
    }) // or use a config.rb file (ruby)
      .on('error', gutil.log))
    .pipe(connect.reload());
    //.pipe(gulp.dest('builds/development/css'))
});

gulp.task('connect', function () {
  connect.server({
    root: outputDir,
    port: 9000,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(htmlSources)
    .pipe(connect.reload());
});

gulp.task('json', function () {
  gulp.src(jsonSources)
    .pipe(connect.reload());
});

gulp.task('default', ['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch']);

gulp.task('watch', function () {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});
