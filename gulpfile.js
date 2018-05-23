const gulp = require('gulp');

const postcss = require('gulp-postcss');

const stylus = require('gulp-stylus');

const imagemin = require('gulp-imagemin');

const tinypng = require('gulp-tinypng');

const autoprefixer = require('autoprefixer'); //自动加上浏览器前缀

const browserSync = require('browser-sync');
const opn = require('opn');

gulp.task('wx-css', () => {
	// console.log(aspectRatio)
	var plugins = [ autoprefixer({ browsers: [ 'last 4 version' ] }) ];
	return gulp.src('./css/*.styl').pipe(stylus()).pipe(postcss(plugins)).pipe(gulp.dest('./dist/css'));
});

gulp.task('wx-png', function() {
	gulp.src('img/*.{png,jpg}').pipe(tinypng('S2DiR0odohioVwKoGNivVMOdzRUEPpwI')).pipe(gulp.dest('./dist/img'));
});

gulp.task('wx-img', function() {
	gulp
		.src('./img/*.{png,jpg,gif,ico}')
		.pipe(
			imagemin({
				progressive: false, //Boolean类型 默认:false 无损压缩图片
				optimizationLevel: 5, //number类型 默认:3 取值范围:0-7(优化等级)
				interlced: true, //Boolean类型 默认false 隔行扫描gif进行渲染
				multipass: true //Boolean类型 默认false 多次优化svg到完全优化
			})
		)
		.pipe(gulp.dest('dist/img'));
	gulp
		.src('./icon/*.{png,jpg,gif,ico}')
		.pipe(
			imagemin({
				progressive: false, //Boolean类型 默认:false 无损压缩图片
				optimizationLevel: 5, //number类型 默认:3 取值范围:0-7(优化等级)
				interlced: true, //Boolean类型 默认false 隔行扫描gif进行渲染
				multipass: true //Boolean类型 默认false 多次优化svg到完全优化
			})
		)
		.pipe(gulp.dest('dist/icon'));
});

gulp.task('wx-js', function() {
	gulp.src('./js/*.js').pipe(gulp.dest('dist/js'));
});

gulp.task('wx-html', function() {
	gulp
		.src('*.html') //指定当前文件夹下的所有html文件
		.pipe(gulp.dest('dist')) //将压缩后的文件输出到build文件夹下
		.pipe(browserSync.stream()); //自动打开浏览器
});
// 定义path
let path = {
	css: './css/*.styl',
	img: './img/*.{png,jpg,gif,ico}',
	js: './js/*.js',
	html: './*.html',
	src: './dist'
};

// 任务列表
const TASK = [ 'wx-css', 'wx-js', 'wx-img', 'wx-html' ];
// const TASK = ['wx-css','wx-html']

gulp.task('default', TASK, function() {
	//打开静态服务器
	browserSync.init(
		{
			server: {
				baseDir: path.src
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
		browserSync.reload();
	});
});
