var project            = require('./package.json'),
    distDir            = project.dist_path,
    assetsDir          = project.resources_path,
    gulp               = require('gulp'),
    gutil              = require('gulp-util'),
    del                = require('del'),
    rename             = require('gulp-rename'),
    imagemin           = require('gulp-imagemin'),
    svgstore           = require('gulp-svgstore'),
    jshint             = require('gulp-jshint'),
    stylish            = require('jshint-stylish'),
    uglify             = require('gulp-uglify'),
    concat             = require('gulp-concat'),
    sass               = require('gulp-sass'),
    sourcemaps         = require('gulp-sourcemaps'),
    autoprefixer       = require('autoprefixer'),
    mqpacker           = require('css-mqpacker'),
    webpack            = require('webpack-stream'),
    postcss            = require('gulp-postcss'),
    cssnano            = require('gulp-cssnano'),
    browserSync        = require('browser-sync').create(),
    environments       = require('gulp-environments'),
    dev                = environments.development,
    prod               = environments.production,
    plumber            = require('gulp-plumber'),
    path               = require('path'),
    webserver          = require('gulp-webserver')
    ;

//CLEAN
gulp.task('clean', function (cb) {
    del([ distDir + '**/*' ], cb);
});


//IMAGES
gulp.task('images', ['imgOptim'], function(){
  browserSync.reload();
});

gulp.task('imgOptim', function () {
    return gulp
        .src(['images/**/*', '!icons', '!**/icons/*'], {cwd: assetsDir})
        .pipe(imagemin())
        .pipe(gulp.dest('images', {cwd: distDir}))
        ;
});

gulp.task('html', ['data'], function () {
    return gulp
        .src('**/*.html', {cwd: assetsDir})
        .pipe(gulp.dest('./', {cwd: distDir}))
        ;
});

gulp.task('data', function () {
    if (process.env.NODE_ENV == 'dev') {
      return gulp
          .src('data/**/*', {cwd: assetsDir})
          .pipe(gulp.dest('data', {cwd: distDir}))
          ;
    }
});

//JS
gulp.task('js', ['jsHint', 'jsMain']);

gulp.task('jsHint', function () {
    return gulp
        .src('js/modules/**/*.js', { cwd: assetsDir })
        .pipe(plumber())
        .pipe(jshint.reporter(stylish))
    ;
});

gulp.task('jsMain', function (callback) {
  return gulp
        .src('js/*.js', {cwd: assetsDir})
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('js', {cwd: distDir}))
        ;
});

//CSS + FONTS
gulp.task('css', ['fontCopy'], function () {
    return gulp
        .src('styles/**/*.scss', { cwd: assetsDir })
        // this will only init sourcemaps in development
        .pipe(dev(sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        // this will only autoprefix & merge media queries in production
        .pipe(postcss([
           autoprefixer({ browsers: ['last 2 version'] }),
           mqpacker({ sort: true }),
        ]))
        .pipe(cssnano({ safe: true }))
        .pipe(gulp.dest('styles', { cwd: distDir }))
        // .pipe(browserSync.stream())
        ;
});

gulp.task('fontCopy', function () {
    return gulp
        .src(['fonts/**/*'], { cwd: assetsDir })
        .pipe(gulp.dest('fonts', { cwd: distDir }))
    ;
});

gulp.task('set-env', function() {
    process.env.NODE_ENV = gutil.env.env || "dev";
    console.log("set environment to: " + process.env.NODE_ENV);
});

// SERVER & LIVERELOAD
gulp.task('webserver', function() {
  gulp.src(distDir)
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: false
    }));
});


// set development environment variable
gulp.task('set-dev', dev.task);
// set production environment variable
gulp.task('set-prod', prod.task);

// BUILD TASK
gulp.task('build', ['set-env', 'images', 'js', 'css', 'html']);

// PROD TASK (default)
gulp.task('default', ['set-env', 'build']);

//WATCH FILES BY TYPE
gulp.task('watch', ['default', 'webserver'], function () {
    gulp
        .watch('images/**/*', { cwd: assetsDir }, [ 'images' ])
        .on('change', function (event) {
            console.log('File ' + event.path + ' has been ' + event.type);
        });
    gulp
        .watch('js/**/*', { cwd: assetsDir }, [ 'js' ])
        .on('change', function (event) {
            console.log('File ' + event.path + ' has been ' + event.type);
        });
    gulp
        .watch('styles/**/*', { cwd: assetsDir }, [ 'css' ])
        .on('change', function (event) {
            console.log('File ' + event.path + ' has been ' + event.type);
        });
    gulp
        .watch('**/*.html', { cwd: assetsDir }, [ 'html' ])
});

gulp.task('w', ['watch']);
