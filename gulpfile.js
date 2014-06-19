var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
	brfs = require('brfs'),
	reactify = require('reactify'),
	rename = require('gulp-rename'),
	paths;


//paths to watch
paths = {
  scripts: ['src/**/*.js', 'client/src/*.js'],
  templates: ['src/templates/*.ejs']
};

gulp.task('scripts', function() {
    gulp.src('src/app.js')
    .pipe(browserify({
    	debug:true,
      transform: [brfs, reactify]
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts'])
	gulp.watch(paths.templates, ['scripts'])
})

gulp.task('default', ['scripts','watch']);