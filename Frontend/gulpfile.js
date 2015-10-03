'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-cleancss');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
// var inline = require('gulp-inline')
var inlineSource = require('gulp-inline-source');
var htmlmin = require('gulp-htmlmin');
// var imagemin = require('gulp-imagemin');

gulp.task('sass_to_css', function () {
	gulp.src('./Styles/Sass/*.sass')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer({
			browsers: ['> 5%']
		}))
		.pipe(cleancss())
		.pipe(gulp.dest('./Styles/CSS'));
});

gulp.task('build', function () {

	gulp.src('HTML/*.html')
		.pipe(inlineSource())
		.pipe(htmlmin({collapseWhitespace: true}))
	 	.pipe(gulp.dest('./Build'));
});

gulp.task('test_build', function () {

	gulp.src('HTML/*.html')
		.pipe(inlineSource())
	 	.pipe(gulp.dest('./Test'));
});

gulp.task('minjs', function () {
	gulp.src('./Scripts/Dev/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./Scripts/Min/'));
});

/*gulp.task('minpic', function () {
	gulp.src('./Assets/Images/*')
		.pipe(imagemin())
		.pipe(gulp.dest("./Build/Assets/Images"));
});*/

gulp.task('watch', function() {
  gulp.watch("./Scripts/Dev/*.js", ['minjs']);
  gulp.watch("./Styles/Sass/*.sass", ['sass_to_css']);
  gulp.watch("./HTML/*.html", ['test_build']);
});

gulp.task('default', ['watch']);