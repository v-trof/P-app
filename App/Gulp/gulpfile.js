'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
  //things sass & css need
var  sass = require('gulp-sass'); //compiles sass into css
var  rename = require('gulp-rename');
var pump = require('pump');
var uglify = require('gulp-uglify');
  //js needs
var  concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('sass_to_css', function () {
  //converts sass to css, prefixes, and minificates css
  gulp.src(['../main/templates/**/*.sass', '../main/templates/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('../main/files/static/'));
});

gulp.task('move_js', function() {
  gulp.src('../main/templates/**/*.js')
      .pipe(gulp.dest('../main/files/static/'));
});

gulp.task('move_module_css', ['sass_to_css'], function() {
  var modules_path = '../main/files/static/Elements/Modules';
  var macro_folders = getFolders(modules_path);
  var folders = [];

  macro_folders.forEach(function(dir) {
    var new_folders = [];
    getFolders(modules_path + '/' + dir).forEach(function(folder) {
      new_folders.push(path.join(dir, folder));
    });

    folders = folders.concat(new_folders);
  });


   var tasks = folders.map(function(folder) {
      return gulp.src(path.join(modules_path, folder, '/**/*.css'))
        .pipe(concat(folder + '.css'))
        .pipe(gulp.dest('../main/files/static/Elements/Modules'));
  });
});

gulp.task('min_module_js', function(cb) {
  var modules_path = '../main/templates/Elements/Modules';
  var macro_folders = getFolders(modules_path);
  var folders = [];

  macro_folders.forEach(function(dir) {
    var new_folders = [];
    getFolders(modules_path + '/' + dir).forEach(function(folder) {
      new_folders.push(path.join(dir, folder));
    });

    folders = folders.concat(new_folders);
  });


   var tasks = folders.map(function(folder) {
      return pump([
        gulp.src([
                  path.join(modules_path, folder, '/__core/**/core.js'),
                  path.join(modules_path, folder, '/**/!(__core)/core.js'),
                  path.join(modules_path, folder, '/**/!(core)*.js'),
                  path.join('!'+modules_path, folder, '/test_suite/**/*.js')
        ]),
        concat(folder + '.js'),
        uglify(),
        gulp.dest('../main/files/static/Elements/Modules')
      ]);
  });

  cb();
});

gulp.task('min_element_js', function(cb) {
  pump([
    gulp.src(['../main/templates/Elements/**/*.js', '!../main/templates/Elements/Modules/**/*.js']),
    uglify(),
    gulp.dest('../main/files/static/Elements')
  ], cb);
});

gulp.task('watch', function() {
  gulp.watch("../main/templates/**/*.sass", ['move_module_css']);
  gulp.watch("../main/templates/**/*.scss", ['move_module_css']);
  gulp.watch('../main/templates/Elements/Modules/**/*.js', ['min_module_js']);
  gulp.watch('../main/templates/**/*.js', ['min_element_js']);
});

gulp.task('default', ['watch']);
