'use strict';

var gulp = require('gulp');
	//things sass & css need
var	sass = require('gulp-sass'); //compiles sass into css
var	rename = require('gulp-rename');
	//js needs
var	concat = require('gulp-concat');

gulp.task('sass_to_css', function () {
	//converts sass to css, prefixes, and minificates css
	gulp.src('../main/templates/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename(function (path) {
			path.dirname += "/css";
		}))
		.pipe(gulp.dest(function(file) {
			return file.base;
		}));
});


gulp.task('concat_test_generate', function() {
  gulp.src(['../main/templates/Elements/Modules/test_generate/_scripts/data/**/*.js'])
    .pipe(concat('data.js'))
    .pipe(rename(function (path) {
		console.log(path.dirname)
		path.dirname = "../";
	}))
    .pipe(gulp.dest(function(file) {
		return file.base;
	}));
});

gulp.task('watch', function() {
  gulp.watch("../main/templates/**/*.sass", ['sass_to_css']);
  gulp.watch('../main/templates/Elements/Modules/test_generate/_scripts/data/**/*.js', ['concat_test_generate']);
});

gulp.task('default', ['watch']);
