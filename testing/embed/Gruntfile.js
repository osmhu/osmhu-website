module.exports = function (grunt) {
	grunt.initConfig({
		env: grunt.option('env') || process.env.GRUNT_ENV || 'development',
		clean: {
			build: 'public/build/*',
			bootstrap: 'public/bootstrap/*',
			leaflet: 'public/leaflet/*'
		},
		browserify: {
			options: {
				browserifyOptions: {
					debug: grunt.option('env') === 'development'
				}
			},
			create: {
				src: 'js/create.js',
				dest: 'public/build/create.js'
			},
			embed: {
				src: 'js/embed.js',
				dest: 'public/build/embed.js'
			}
		},
		copy: {
			bootstrap: {
				expand: true,
				cwd:  'node_modules/bootstrap/dist',
				src:  '**',
				dest: 'public/bootstrap'
			},
			leaflet: {
				expand: true,
				cwd:  'node_modules/leaflet/dist',
				src:  '**',
				dest: 'public/leaflet'
			}
		},
		watch: {
      		grunt: {
				files: [ 'Gruntfile.js' ],
				options: {
					reload: true
				}
			},
			components: {
				files: ['js/**/*.js'],
				tasks: ['clean:build', 'browserify:create', 'browserify:embed'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('development', [
		'clean:bootstrap', 'copy:bootstrap',
		'clean:leaflet', 'copy:leaflet',
		'clean:build', 'browserify:create', 'browserify:embed'
	]);
	//grunt.registerTask('production', prodTasks);
};
