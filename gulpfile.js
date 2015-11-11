/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/gulp-less/gulp-less.d.ts" />

var gulp = require('gulp');
var ts  = require('gulp-typescript');
var less = require('gulp-less');

// config

var path = {
    src : {
        html: "src/html/**/*.html",
        ts: "src/ts/**/*.ts",
        less: "src/less/**/*.less",
    },
    dest : {
        html: "dest/html/",
        js: "dest/js/",
        css: "dest/css/",
    }
};

var tsProject = ts.createProject('src/tsconfig.json', {out: "app.js"});

// main tasks

gulp.task('build', ['build:html', 'build:ts', 'build:less']);

gulp.task('watch', ['watch:html', 'watch:ts', 'watch:less']);

// sub tasks

gulp.task('build:html', function(){
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dest.html));
});

gulp.task('build:ts', function(){
    var tsResult = gulp.src(path.src.ts)
        .pipe(ts(tsProject));
    
    tsResult.js.pipe(gulp.dest(path.dest.js));
});

gulp.task('build:less', function(){
    gulp.src(path.src.less)
        .pipe(less())
        .pipe(gulp.dest(path.dest.css));
});

gulp.task('watch:html', function(){
    gulp.watch(path.src.html, ['build:html']);
});

gulp.task('watch:ts', function(){
    gulp.watch(path.src.ts, ['build:ts']);
});

gulp.task('watch:less', function(){
    gulp.watch(path.src.less, ['build:less']);
});