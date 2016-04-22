'use strict';

var gulp = require('gulp');
	//things sass & css need
var	sass = require('gulp-sass'); //compiles sass into css

gulp.task('sass_to_css', function () {
	//converts sass to css, prefixes, and minificates css
	gulp.src('../main/templates/Styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(function(file) {
			return file.base;
		}));
});


gulp.task('watch', function() {
  gulp.watch("../main/templates/Styles/**/*.sass", ['sass_to_css']);
});

gulp.task('default', ['watch']);
