const gulp = require('gulp')

const postcss = require('gulp-postcss')

const stylus = require('gulp-stylus')

const imagemin = require('gulp-imagemin')

const tinypng = require('gulp-tinypng')

const autoprefixer = require('autoprefixer'); //自动加上浏览器前缀

const cssnano = require('cssnano');

const cssnext = require('postcss-cssnext');

const aspectRatio = require('postcss-aspect-ratio-mini');

const viewportUnits = require('postcss-viewport-units')

const postcsswritesvg = require('postcss-write-svg') 

// UI设计稿750px宽，那么100vw = 750px，即1vw = 7.5px
const pxtoviewport = require('postcss-px-to-viewport'); // 代码中写px编译后转化成vm


const browserSync = require('browser-sync')
const opn = require('opn')

gulp.task('wx-css', () => {
    // console.log(aspectRatio)
    var plugins = [
        aspectRatio({}),
        postcsswritesvg({
            utf8:false
        }),
        pxtoviewport({
            viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750 
            viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置 
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除） 
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw 
            selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名 
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值 
            mediaQuery: false // 允许在媒体查询中转换`px`著作权归作者所有。             
        }),
        viewportUnits({}),
        autoprefixer({browsers: ['last 2 version']}),
        cssnano({
            preset:"advanced",
            autoprefixer:false,
            "postcss-zindex":false
        })        
    ];
    return gulp.src('./css/*.styl')
        .pipe(stylus())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
})

gulp.task('wx-png', function () {
	gulp.src('img/*.{png,jpg}')
		.pipe(tinypng('S2DiR0odohioVwKoGNivVMOdzRUEPpwI'))
		.pipe(gulp.dest('./dist/img'));
});


gulp.task('wx-img', function() {
    gulp.src('./img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: false, //Boolean类型 默认:false 无损压缩图片
            optimizationLevel: 5, //number类型 默认:3 取值范围:0-7(优化等级)
            interlced: true, //Boolean类型 默认false 隔行扫描gif进行渲染
            multipass: true //Boolean类型 默认false 多次优化svg到完全优化                                                
        }))
        .pipe(gulp.dest('dist/img'));
})

gulp.task('wx-js', function () {
    gulp.src('./js/*.js')   
    .pipe(gulp.dest('dist/js')) 
})

gulp.task('wx-html', function () {
    gulp.src('*.html') //指定当前文件夹下的所有html文件        
        .pipe(gulp.dest('dist')) //将压缩后的文件输出到build文件夹下
        .pipe(browserSync.stream()); //自动打开浏览器

})
// 定义path
let path = {
    css: './css/*.styl',
    img:'./img/*.{png,jpg,gif,ico}',
    js: './js/*.js',
    html: './*.html',
    src: './dist'    
};

// 任务列表
const TASK = ['wx-css', 'wx-js', 'wx-png', 'wx-html']
// const TASK = ['wx-css','wx-html']

gulp.task('default', TASK, function(){    
    //打开静态服务器
    browserSync.init({
        server:{
            baseDir: path.src
        },
        port:3000,
        open:false
    }, function(){
        var homepage = 'http://localhost:3000/';
        opn(homepage);
    });

    //监听文件的变化实时编译 然后刷新
    const watcher = gulp.watch([path.html, path.js, path.css, path.img], TASK)
    watcher.on("change", function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');     
        browserSync.reload();
    });
});







    


