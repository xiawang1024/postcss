const gulp = require('gulp');

const del = require('del');

const postcss = require('gulp-postcss');

const stylus = require('gulp-stylus');

const uglify = require('gulp-uglify');

const babel = require('gulp-babel');

const sourceMaps = require('gulp-sourcemaps');

const concat = require('gulp-concat');

const rev = require('gulp-rev');

const revRewrite = require('gulp-rev-rewrite');

const revDelete = require('gulp-rev-delete-original');

const imagemin = require('gulp-imagemin');

const tinyPng = require('gulp-tinypng');

const autoprefixer = require('autoprefixer'); //自动加上浏览器前缀

const cssnano = require('cssnano');

const cssNext = require('postcss-cssnext');

const aspectRatio = require('postcss-aspect-ratio-mini');

const viewportUnits = require('postcss-viewport-units');

const postcssWriteSvg = require('postcss-write-svg');

// UI设计稿750px宽，那么100vw = 750px，即1vw = 7.5px
const pxToViewport = require('postcss-px-to-viewport'); // 代码中写px编译后转化成vm

const browserSync = require('browser-sync');
const opn = require('opn');

// 定义path
let baseDir = './src';
let cssDir = `${baseDir}/css/*.styl`;
let jsDir = `${baseDir}/js/*.js`;
let imgDir = `${baseDir}/img/*.{png,jpg,gif,ico}`;
let htmlDir = `${baseDir}/*.html`;
let outDir = `${baseDir}/dist`;
let path = {
	css: `${baseDir}/css/*.styl`,
	img: `${baseDir}/img/*.{png,jpg,gif,ico}`,
	js: `${baseDir}/js/*.js`,
	html: `${baseDir}/*.html`,
	dist: `${baseDir}/dist`
};

gulp.task('wx-css', () => {
	// console.log(aspectRatio)
	const plugins = [
		aspectRatio({}),
		postcssWriteSvg({
			utf8: false
		}),
		pxToViewport({
			viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
			viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
			unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
			viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
			selectorBlackList: [ '.ignore', '.hairlines' ], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
			minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
			mediaQuery: false // 允许在媒体查询中转换`px`著作权归作者所有。
		}),
		viewportUnits({}),
		autoprefixer({ browsers: [ 'last 2 version' ] }),
		cssnano({
			preset: 'advanced',
			autoprefixer: false,
			'postcss-zindex': false
		})
	];
	return gulp
		.src(cssDir)
		.pipe(sourceMaps.init())
		.pipe(stylus())
		.pipe(postcss(plugins))
		.pipe(concat('app.css'))
		.pipe(gulp.dest(`${outDir}/css/`));
});

gulp.task('wx-js', () => {
	return gulp
		.src(jsDir)
		.pipe(sourceMaps.init())
		.pipe(
			babel({
				presets: [ 'env' ]
			})
		)
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest(`${outDir}/js/`));
});

gulp.task('wx-png', function() {
	return gulp.src(imgDir).pipe(tinyPng('S2DiR0odohioVwKoGNivVMOdzRUEPpwI')).pipe(gulp.dest(`${outDir}/img/`));
});

gulp.task('wx-img', function() {
	return gulp
		.src(imgDir)
		.pipe(
			imagemin({
				progressive: false, //Boolean类型 默认:false 无损压缩图片
				optimizationLevel: 5, //number类型 默认:3 取值范围:0-7(优化等级)
				interlced: true, //Boolean类型 默认false 隔行扫描gif进行渲染
				multipass: true //Boolean类型 默认false 多次优化svg到完全优化
			})
		)
		.pipe(gulp.dest(`${outDir}/img/`));
});

gulp.task('wx-html', function() {
	return gulp
		.src(htmlDir) //指定当前文件夹下的所有html文件
		.pipe(gulp.dest(`${outDir}`)) //将压缩后的文件输出到build文件夹下
		.pipe(browserSync.stream()); //自动打开浏览器
});

gulp.task('clean', () => {
	return del([ `${outDir}/css/*`, `${outDir}/js/*` ]);
});

gulp.task('revision', [ 'wx-css', 'wx-js', 'wx-html', 'clean' ], () => {
	return gulp
		.src(`${outDir}/**/*.{css,js}`)
		.pipe(rev())
		.pipe(revDelete()) // Remove the unrevved files
		.pipe(gulp.dest(`${outDir}`))
		.pipe(rev.manifest())
		.pipe(gulp.dest(`${outDir}`));
});

gulp.task('revRewrite', [ 'revision' ], function() {
	const manifest = gulp.src(`${outDir}/rev-manifest.json`);

	return gulp.src(`${outDir}/index.html`).pipe(revRewrite({ manifest })).pipe(gulp.dest(`${outDir}`));
});

// 任务列表
const TASK = [ 'wx-img', 'revRewrite' ];

gulp.task('default', TASK, function() {
	//打开静态服务器
	browserSync.init(
		{
			server: {
				baseDir: path.dist
			},
			port: 3000,
			open: false
		},
		function() {
			var homepage = 'http://localhost:3000/';
			opn(homepage);
		}
	);

	//监听文件的变化实时编译 然后刷新
	const watcher = gulp.watch([ path.html, path.js, path.css, path.img ], TASK);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		setTimeout(() => {
			browserSync.reload();
		}, 1000);
	});
});
