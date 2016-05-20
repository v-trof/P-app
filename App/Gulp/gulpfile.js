'use strict';

var gulp = require('gulp');
	//things sass & css need
var	sass = require('gulp-sass'); //compiles sass into css
var	rename = require('gulp-rename');

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


gulp.task('watch', function() {
  gulp.watch("../main/templates/**/*.sass", ['sass_to_css']);
});

gulp.task('default', ['watch']);
