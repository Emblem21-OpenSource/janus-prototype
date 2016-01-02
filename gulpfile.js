var pkg = require('./package.json');
var config = require('./config/config.json');
var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var header = require('gulp-header');
var spritesmith = require('gulp.spritesmith');
var pm2 = require('pm2');
var fs = require('fs');

gulp.task('process:images', function(next) {
  gulp.src('./' + config.build.images.source).
    pipe(spritesmith({
      imgName: 'janus.png',
      cssName: 'sprite.css'
    })).
    pipe(gulp.dest(config.build.images.destination)).
    on('end', next);
});

gulp.task('minify:css', ['process:images'], function(next) {
  gulp.src([
      './' + config.build.css.source,
      './' + config.build.images.destination + '/sprite.css'
    ]).
    pipe(concat('janus.css')).
    pipe(minifyCss()).
    pipe(gulp.dest(config.build.css.destination)).
    on('end', function() {
      fs.unlinkSync(config.build.images.destination + '/sprite.css');
      next();
    });
});

gulp.task('minify:html', function() {
  gulp.src('./' + config.build.html.source).
    pipe(concat('index.html')).
    pipe(minifyHtml()).
    pipe(gulp.dest(config.build.html.destination));
});

gulp.task('lint:js', function(next) {
  gulp.src('./' + config.build.js.source).
    on('end', next).
    pipe(jshint()).
    pipe(jshint.reporter());
});

gulp.task('minify:js', ['lint:js'], function() {
  gulp.src('./' + config.build.js.source).
    pipe(concat('janus.js')).
    pipe(minifyJs()).
    pipe(header("/*\n" + fs.readFileSync(config.build.copywrite) + "\n*/\n", {
      version: pkg.version
    })).
    pipe(gulp.dest(config.build.js.destination));
});

gulp.task('watch', function(next) {
  gulp.watch(['./' + config.build.html.source],   ['minify:html']);
  gulp.watch(['./' + config.build.css.source],    ['minify:css']);
  gulp.watch(['./' + config.build.js.source],     ['minify:js']);
  gulp.watch(['./' + config.build.images.source], ['minify.css']);
  pm2.connect(true, function() {
    pm2.start(require('./config/pm2-dev.json'), function() {
      pm2.flush(function() {
        pm2.streamLogs('all', 0);
        next();  
      });
    });
  });
});

gulp.task('build', ['minify:html', 'minify:css', 'minify:js']);