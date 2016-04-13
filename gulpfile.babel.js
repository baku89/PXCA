/* global process */

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const webpack = require('webpack')
const WebpackStream = require('webpack-stream')
const BrowserSync = require('browser-sync')

const browserSync = BrowserSync.create()

let developmentMode = true

process.env.NODE_ENV = 'dev'

//==================================================
gulp.task('webpack', () => {
	let config = require('./webpack.config.js')

	// modify conig
	if (developmentMode) {
		config.devtool = 'inline-source-map'
		config.watch = true
	} else {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin()
		)
	}

	return gulp.src('')
		.pipe($.plumber())
		.pipe(WebpackStream(config))
		.pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream())
})

//==================================================
gulp.task('babel', () => {
	return gulp.src('src/index.js')
		.pipe($.plumber())
		.pipe($.eslint({useEslintrc: true}))
		.pipe($.sourcemaps.init())
		.pipe($.babel({presets: ['es2015']}))
		.pipe(gulp.dest('public'))
})

//==================================================
gulp.task('jade', () => {
	return gulp.src('./src/*.jade')
		.pipe($.plumber())
		.pipe($.jadePhp({pretty: developmentMode}))
		.pipe(gulp.dest('public'))
		.pipe(browserSync.stream())
})

//==================================================
gulp.task('stylus', () => {
	return gulp.src('./src/style.styl')
		.pipe($.plumber())
		.pipe($.stylus({use: [require('nib')()]}))
		.pipe($.autoprefixer())
		.pipe($.if(!developmentMode, $.minifyCss()))
		.pipe(gulp.dest('public'))
		.pipe(browserSync.stream())
})


//==================================================
gulp.task('browser-sync', () => {
	browserSync.init({
		proxy: 'localhost:8888',
		open: false
	})
})

//==================================================
gulp.task('watch', () => {
	gulp.watch('./src/index.js', ['babel'])
	gulp.watch('./src/**/*.styl', ['stylus'])
	gulp.watch(['./src/**/*.jade', './src/jade/*'], ['jade'])
})

//==================================================
gulp.task('release', () => {
	developmentMode = false
	process.env.NODE_ENV = 'production'
})


//==================================================

gulp.task('default', ['webpack', 'jade', 'stylus', 'babel', 'watch', 'browser-sync'])
gulp.task('build', ['release', 'jade', 'stylus', 'webpack'])