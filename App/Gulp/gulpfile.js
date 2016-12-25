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

gulp.task('min_modules_js', function(cb) {
  var modules_path = '../main/templates/Elements/Modules';
  var macro_folders = getFolders(modules_path);
  var folders = [];

  console.log(macro_folders);

  macro_folders.forEach(function(dir) {
    console.log(modules_path + '/' + dir, getFolders(modules_path + '/' + dir));
    var new_folders = [];
    getFolders(modules_path + '/' + dir).forEach(function(folder) {
      new_folders.push(path.join(dir, folder));
    });

    folders = folders.concat(new_folders);
  });

  console.log(folders);


   var tasks = folders.map(function(folder) {
      return pump([
        gulp.src(path.join(modules_path, folder, '/**/*.js')),
        concat(folder + '.js'),
        uglify(),
        gulp.dest('../main/files/static/Elements/')
      ]);
  });

  cb();
});

gulp.task('min_elements_js', function(cb) {
  pump([
    gulp.src(['../main/templates/Elements/**/*.js', '!../main/templates/Elements/Modules/**/*.js']),
    uglify(),
    gulp.dest('../main/files/static/Elements')
  ], cb);
});

gulp.task('concat_test_generate', function() {
  gulp.src(['../main/templates/Elements/Modules/test_generate/_scripts/data/**/*.js'])
    .pipe(concat('data.js'))
    .pipe(rename(function (path) {
      path.dirname = "../";
     }))
    .pipe(gulp.dest(function(file) {
      return file.base;
  }));

  gulp.src(['../main/templates/Elements/Modules/test_generate/_scripts/build/**/*.js'])
    .pipe(concat('build.js'))
    .pipe(rename(function (path) {
      path.dirname = "../";
    }))
    .pipe(gulp.dest(function(file) {
      return file.base;
  }));
});

gulp.task('watch', function() {
  gulp.watch("../main/templates/**/*.sass", ['sass_to_css']);
  gulp.watch("../main/templates/**/*.scss", ['sass_to_css']);
  gulp.watch('../main/templates/**/*.js', ['min_js'])
  // gulp.watch('../main/templates/Elements/Modules/test_generate/_scripts/**/*.js', ['concat_test_generate']);
});

gulp.task('default', ['watch', 'concat_test_generate']);
