var gulp = require('gulp');
var gls = require('gulp-live-server');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

var server = gls([gls.script, 'www', 8001]);

gulp.task('default', ['browserify', 'serve'], function() {});

gulp.task('browserify', function() {
    var b = browserify({
        entries: 'www/scripts/app.js',
        debug: true,
        transform: [reactify]
    });

    return b.bundle()
            .pipe(source('index.js'))
            .pipe(rename('bundle.js'))
            .pipe(gulp.dest('www/scripts/dist/'));
});

gulp.task('restart', function() {
    server.start.bind(server);
});

gulp.task('serve', function() {
    //1. gls is the base for `static` and `new` 
    //equals gls.new([gls.script, 'static', 8000]); 
    //equals gls.static('static', 8000); 
    server.start();
 
    //2. set running options for the server, e.g. NODE_ENV 
 //   var server = gls('app.js', {env: {NODE_ENV: 'development'}});
 //   server.start();
 
    //3. customize livereload server, e.g. port number 
 //   var server = gls('app.js', undefined, 12345);
 //   var promise = server.start();
    //optionally handle the server process exiting 
 //   promise.then(function(result) {
      //log, exit, re-start, etc... 
 //   });
 
    //use gulp.watch to trigger server actions(notify, start or stop) 
    gulp.watch(['www/static/**/*.css', 'www/*.html'], function (file) {
      server.notify.apply(server, [file]);
    });

    gulp.watch('www/scripts/app.js', ['browserify','restart'])
    //gulp.watch('myapp.js', server.start.bind(server)); //restart my server 
    
    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn` 
    // gulp.watch('myapp.js', function() {
    //   server.start.bind(server)()
    // });
  });