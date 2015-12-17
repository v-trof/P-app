'use strict';

var gulp = require('gulp');
	//things sass & css need
var	sass = require('gulp-sass'); //compiles sass into css
var	cleancss = require('gulp-cleancss'); //makes css lighter
var	autoprefixer = require('gulp-autoprefixer'); //sets vendor prefixes in
var rename = require("gulp-rename"); //renames a file
var templater = require("p-gulp-template"); //turns html into django template, templates css and js
	//things js needs
var	uglify = require('gulp-uglify'); //makes js lighter
	//things html needs
var	htmlmin = require('gulp-htmlmin'); //makes html lighter
var	inlineSource = require('gulp-inline-source'); //inlines svg,css,js
var	remove = require('gulp-html-remove'); //removes things you don't want from html
// var imagemin = require('gulp-imagemin'); //makes images lighter

gulp.task('sass_to_css', function () {
	//converts sass to css, prefixes, and minificates css
	gulp.src('./Styles/Sass/*/*.sass')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer({
			browsers: ['> 5%']
		}))
		.pipe(cleancss())
		.pipe(gulp.dest('./Styles/CSS'));

	gulp.src('./Styles/Sass/main.sass')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer({
			browsers: ['> 5%']
		}))
		.pipe(cleancss())
		.pipe(gulp.dest('./Styles/CSS'));
});

gulp.task('build', function () {
	//removes useless shit from html
	gulp.src('HTML/*.html')
		.pipe(remove("[dev]")) //removes elements with attr dev
		.pipe(inlineSource())
		.pipe(templater());
});

gulp.task('test_build',function () {
	//build with no minification and other user-needs dev-hates stuff
	gulp.src('HTML/*.html')
		.pipe(inlineSource())
		.pipe(gulp.dest('./Test'));
	gulp.src('HTML/Teacher/*.html')
		.pipe(inlineSource())
		.pipe(gulp.dest('./Test/Teacher'));
});

gulp.task('minjs', function () {
	//minifcates js
	gulp.src('./Scripts/Dev/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./Scripts/Min/'));
});

/*gulp.task('minpic', function () {
	//minificates pics
	gulp.src('./Assets/Images/*')
		.pipe(imagemin())
		.pipe(gulp.dest("./Build/Assets/Images"));
});*/

//for testing how sass behaves
gulp.task('sass_test', function () {
	//converts sass to css, prefixes, and minificates css
	gulp.src('./Styles/Sass/*.sass')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['> 5%']
		}))
		.pipe(gulp.dest('./Styles/CSS/Test'));
});	

gulp.task('watch', function() {
  gulp.watch("./Scripts/Dev/*.js", ['minjs','test_build']);
  gulp.watch("./Styles/Sass/*/*.sass", ['sass_to_css','test_build']);
  gulp.watch("./Styles/Sass/main.sass", ['sass_to_css','test_build']);
  gulp.watch("./HTML/*.html", ['test_build']);
  gulp.watch("./HTML/Teacher/*.html", ['test_build']);
});

gulp.task('default', ['watch']);