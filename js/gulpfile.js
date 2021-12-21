const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const sourcemaps = require('gulp-sourcemaps');

const rootDir = '../';

gulp.task('pack-css-common', () => gulp.src([
	rootDir + 'node_modules/normalize.css/normalize.css',
	rootDir + 'css/common/layout.css',
])
	.pipe(sourcemaps.init())
	.pipe(concat('common.css'))
	.pipe(minify())
	.pipe(cleanCss())
	.pipe(stripCssComments())
	.pipe(sourcemaps.write('.', { sourceRoot: rootDir + 'distribution/css' }))
	.pipe(gulp.dest(rootDir + 'distribution/css')));

gulp.task('pack-css-frontpage', () => gulp.src([
	rootDir + 'node_modules/leaflet/dist/leaflet.css',
	rootDir + 'node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css',
	rootDir + 'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
	rootDir + 'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
	rootDir + 'css/frontpage/autocomplete.css',
	rootDir + 'css/frontpage/direction-results.css',
	rootDir + 'css/frontpage/introduction.css',
	rootDir + 'css/frontpage/map.css',
	rootDir + 'css/frontpage/poi-layer-selector.css',
	rootDir + 'css/frontpage/poi-popup.css',
	rootDir + 'css/frontpage/search-results.css',
	rootDir + 'css/frontpage/send-location-popup.css',
	rootDir + 'css/frontpage/main.css',
])
	.pipe(sourcemaps.init())
	.pipe(concat('frontpage.css'))
	.pipe(minify())
	.pipe(cleanCss())
	.pipe(stripCssComments())
	.pipe(sourcemaps.write('.', { sourceRoot: rootDir + 'distribution/css' }))
	.pipe(gulp.dest(rootDir + 'distribution/css')));

gulp.task('pack-css-info', () => gulp.src([
	rootDir + 'css/info/info.css',
])
	.pipe(sourcemaps.init())
	.pipe(concat('info.css'))
	.pipe(minify())
	.pipe(cleanCss())
	.pipe(stripCssComments())
	.pipe(sourcemaps.write('.', { sourceRoot: rootDir + 'distribution/css' }))
	.pipe(gulp.dest(rootDir + 'distribution/css')));

gulp.task('default', gulp.parallel('pack-css-common', 'pack-css-frontpage', 'pack-css-info'));
