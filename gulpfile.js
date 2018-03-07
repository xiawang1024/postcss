const gulp = require('gulp')

const postcss = require('gulp-postcss')

const stylus = require('gulp-stylus')

// const poststylus = require('poststylus')

const autoprefixer = require('autoprefixer'); //自动加上浏览器前缀

const cssnano = require('cssnano');

const cssnext = require('postcss-cssnext');

const aspectRatio = require('postcss-aspect-ratio-mini');

const viewportUnits = require('postcss-viewport-units')

const postcsswritesvg = require('postcss-write-svg') 

// UI设计稿750px宽，那么100vw = 750px，即1vw = 7.5px
const pxtoviewport = require('postcss-px-to-viewport'); // 代码中写px编译后转化成vm

gulp.task('default', () => {
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
        .pipe(gulp.dest('./dist'));
})









    


