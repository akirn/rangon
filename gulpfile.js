'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  mocha = require('gulp-mocha'),
  clean = require('gulp-clean'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  size = require('gulp-size'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  pkg = require('./package.json');

gulp.task('lint', function () {
  return gulp.src('./public/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('mocha', function () {
  gulp.src('./test/*.js')
    .pipe(mocha({ reporter: 'list' }));
});

gulp.task('build_angular_js', [], function () {
  return gulp.src('./public/vendor/angular/angular.min.js')
    .pipe(size())
    .pipe(gulp.dest('./public/js/vendor'));
});

gulp.task('build_angular_map', [], function () {
  return gulp.src('./public/vendor/angular/angular.min.js.map')
    .pipe(size())
    .pipe(gulp.dest('./public/js/vendor'));
});

gulp.task('build_angular-route_js', [], function () {
  return gulp.src('./public/vendor/angular-route/angular-route.min.js')
    .pipe(size())
    .pipe(gulp.dest('./public/js/vendor'));
});

gulp.task('build_angular-route_map', [], function () {
  return gulp.src('./public/vendor/angular-route/angular-route.min.js.map')
    .pipe(size())
    .pipe(gulp.dest('./public/js/vendor'));
});

gulp.task('build_bootstrap_css', [], function () {
  return gulp.src('./public/vendor/bootstrap/dist/css/bootstrap.min.css')
    .pipe(size())
    .pipe(gulp.dest('./public/css/vendor'));
});

gulp.task('build_font-awesome_css', [], function () {
  return gulp.src('./public/vendor/font-awesome/css/font-awesome.min.css')
    .pipe(size())
    .pipe(gulp.dest('./public/css/vendor'));
});

gulp.task('build_vendor',
  [
    'build_angular_js',
    'build_angular_map',
    'build_angular-route_js',
    'build_angular-route_map',
    'build_bootstrap_css',
    'build_font-awesome_css'
  ]
);

gulp.task('clean', function () {
  return gulp.src('./public/js/*.js', { read: false })
    .pipe(clean());
});

gulp.task('build', ['test', 'clean'], function () {
  return gulp.src('./public/js/**/*.js')
    .pipe(gulp.dest('./public/js'))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('bump', ['build'], function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('tag', ['bump'], function () {
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

gulp.task('npm', ['tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('test', ['lint', 'mocha']);
gulp.task('ci', ['build']);
gulp.task('release', ['npm']);

