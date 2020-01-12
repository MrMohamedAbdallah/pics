const gulp = require("gulp"),
  sass = require("gulp-sass"),
  prefixer = require("gulp-autoprefixer"),
  concat    = require("gulp-concat"),  
  uglify    = require("gulp-uglify"),  
  babel    = require("gulp-babel"),  
  imagemin  = require("gulp-imagemin"),
  png       = require("imagemin-pngquant"),
  jpeg      = require("imagemin-jpeg-recompress"),
  rename = require("gulp-rename"),
  livereload = require("gulp-livereload"),
  sourcemap = require("gulp-sourcemaps"),
  pug     = require("gulp-pug");

// Source object
const source = {
  sass: "source/scss/*.scss",
  sassWatch: "source/scss/**/*.scss",
  js: "source/js/*.js",
  jsWatch: "source/js/**/*.js",
  images: "source/images/**/*.*",
  pug: "source/pug/*.pug"
};
// Dist object
const dist = {
  css: "dist/css",
  js: "dist/js",
  images: "dist/images",
  html: "dist"
};

// ==================== Tasks ====================

/**
 * html task
 * + Just using livereload
 */
gulp.task("html", function(){
    return  gulp.src(source.pug)
                .pipe(pug({pretty: true}))  // For prettey output
                .pipe(gulp.dest(dist.html))
                .pipe(livereload())
})

/**
 * CSS task
 * + Compile sass files
 * + Add prifixers
 * + Rename the file
 * + Make source map
 * + Move the file to dist folder
 */
gulp.task("css", function() {
  return gulp
    .src(source.sass)
    .pipe(sourcemap.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError)) // -
    .pipe(prefixer({ Browserslist: "last 2 versions" }))
    .pipe(
      rename({
        suffix: ".min"
      })
    ) // -
    .pipe(sourcemap.write("./"))
    .pipe(gulp.dest(dist.css))
    .pipe(livereload());
});

/**
 * CSS concat
 * Same as "css" task but it concatenates all files together 
 */
gulp.task("css.concat", function() {
  return gulp
    .src(source.sass)
    .pipe(sourcemap.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError)) 
    .pipe(prefixer({ Browserslist: "last 2 versions" }))
    .pipe(concat('all.min.css'))
    .pipe(sourcemap.write("./"))
    .pipe(gulp.dest(dist.css))
    .pipe(livereload());
});



/**
 * JS babel task
 * + Compile js files
 * + Move the file to dist folder
 */
gulp.task("js", function(){
    return  gulp.src(source.js)
                .pipe(sourcemap.init())
                .pipe(concat('all.min.js'))
                .pipe(uglify())
                .pipe(sourcemap.write('./'))
                .pipe(gulp.dest(dist.js))
                .pipe(livereload());
})
/**
 * JS babel task
 * same as "js" task but using babel
 */
gulp.task("js.babel", function(){
    return  gulp.src(source.js)
                .pipe(sourcemap.init())
                .pipe(babel({presets: ['@babel/env']}))
                .pipe(concat('app.min.js'))
                .pipe(uglify())
                .pipe(sourcemap.write('./'))
                .pipe(gulp.dest(dist.js))
                .pipe(livereload());
})


/**
 * Images task
 * + Minifiy all images
 * + Move all images to the dist folder
 */
gulp.task('images', function(){
    return  gulp.src(source.images)
                .pipe(imagemin([
                    imagemin.gifsicle(),
                    imagemin.jpegtran(),
                    imagemin.optipng(),
                    imagemin.svgo(),
                    png(),
                    jpeg(),

                ]))
                .pipe(gulp.dest(dist.images));
})


/**
 * Watch taks
 * + Watch files in development process
 */
gulp.task("watch", function(){
    // SCSS
    gulp.watch(source.sassWatch, gulp.series(...["css"]));
    gulp.watch(source.jsWatch, gulp.series(...["js.babel"]));
    gulp.watch("source/pug/**/*.pug", gulp.series(...["html"]));
    require("./Server.js");
    livereload.listen();
})

/**
 * Default taks
 */
// gulp.task("default", function(){
//     console.log("Gulp workflow has been started successfully");
// })

// ["css", "js.babel", "watch"]
gulp.task("default", gulp.series(...["css", "js.babel", "watch"]));






