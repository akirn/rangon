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
  return gulp.src('./public/js/*/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('mocha', function () {
  gulp.src('./test/*.js')
    .pipe(mocha({ reporter: 'list' }));
});

gulp.task('clean', function () {
  return gulp.src('./public/js/*.js', { read: false })
    .pipe(clean());
});

gulp.task('build', ['test', 'clean'], function () {
  return gulp.src('./public/js/*/*.js')
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

