// dependencies
var gulp          = require('gulp'),
    imagemin      = require('gulp-imagemin'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    concat        = require('gulp-concat'),
    watch         = require('gulp-watch'),
    livereload    = require('gulp-livereload'),
    cleanCSS      = require('gulp-clean-css'),
    browserSync   = require('browser-sync').create(),
    plumber       = require('gulp-plumber'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('gulp-autoprefixer'),
    pngquant      = require('imagemin-pngquant'), //深度壓縮png
    sourcemaps    = require('gulp-sourcemaps'), //來源地圖
    changed       = require('gulp-changed'),    //有修改過的文件才會變更
    gutil         = require('gulp-util'), //上顏色console.log
    colors        = gutil.colors;

// Logs Message
gulp.task('message', function(){
  return console.log('\n'+ colors.red('Gulp 正常運作中...'))
})

// Copy ALL HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/**/*.html')
      .pipe(plumber())
      .pipe(gulp.dest('public'))
      .pipe(browserSync.stream()); //自動重新整理
  return console.log('任務「CopyHtml」已完成，請到dist資料夾查看。');
});

// Optimize Images 優化圖片
gulp.task('imageMin', function(){
  gulp.src('src/images/*')
    .pipe(changed( public/images ))
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true, //無損壓縮jpg圖
      use: [pngquant()] //深度壓縮PNG
    }))
    .pipe(gulp.dest('public/images'))
    
  return console.log('任務「Optimize Images」，優化圖片已完成。');
});

// Compile Scss
gulp.task('sass',function(){
  var plugins = [
        autoprefixer({browsers: ['last 3 version']})
  ];
  gulp.src('src/sass/*.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      // 編譯完成 CSS
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write('map'))
      .pipe(gulp.dest('public/css'))
      .pipe(livereload())
      .pipe(browserSync.stream());
  return console.log('任務「 Compile Sass 」，轉換成CSS已完成。');
});

// Conpile css
gulp.task('css', function(){
  gulp.src(['src/css/bootstrap.css','src/css/style.css','src/css/responsive.css'])
      .pipe(plumber())
      .pipe(cleanCSS())
      .pipe(concat('style.css'))
      .pipe(gulp.dest('public/css'))
      .pipe(browserSync.stream());
  return console.log('任務「 Minify CSS 」，mini CSS已打包完成。');
});

// Scripts 打包成一個main.js
gulp.task('scripts', function(){
  gulp.src(["src/js/jquery-1.9.1.min.js", "src/js/bootstrap.js", "src/js/classie.js","src/js/smooth-scroll.min.js","src/js/**/*.js"])
      .pipe(plumber())
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest('public/js'))
      .pipe(browserSync.stream());
  return console.log('任務「 Scripts 」，所有js壓縮並匯集成main.js，已打包完成。');
});


// Static server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});

// Default task
gulp.task('default', ['message', 'copyHtml', 'imageMin', 'sass', 'css','scripts','browserSync', 'watch'])



// Watch task
gulp.task('watch', function(){

  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['imageMin']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['copyHtml']);
  gulp.watch('src/css/**/*.css', ['css']);

  // 建立即時重整伺服器
  livereload.listen();
  gulp.watch(['public/**']).on('change', livereload.changed);

  return console.log('任務「 Watch 」，目前正在監視中。');
});

