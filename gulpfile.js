var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	babel = require("gulp-babel"),
	useref = require('gulp-useref');
	//wiredep = require('wiredep').stream;

// Build all
gulp.task('html', ['babel'], function () {
	var assets = useref.assets();

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('app.js', babel()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task("babel", function () {
  return gulp.src("app/js/app.js")
    .pipe(babel())
    .pipe(gulp.dest("app/js/render"));
});
// bower
// gulp.task('bower', function () {
// 	gulp.src('./app/index.html')
// 	.pipe(wiredep({
// 		directory : "app/bower_components"
// 	}))
// 	.pipe(gulp.dest('./app'));
// });

// gulp.task('watch', function () {
// 	gulp.watch('bower.json', ['bower']);
// })


gulp.task('default', ['babel', 'html']);