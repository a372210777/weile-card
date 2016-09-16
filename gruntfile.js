'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverJS: ['gruntfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js'],
		clientJS: ['public/app/**/*.js'],
		clientCSS: ['public/stylus/**/*.styl']
	};
	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			dev: {
				NODE_ENV: 'development'
			}
		},
		jshint: {
			all: {
				src: watchFiles.serverJS,
				options: {
					jshintrc: true
				}
			}
		},
		stylus: {
			all: {
				files: {
					'public/css/bundle.css': watchFiles.clientCSS
				}
			}
		},
		browserify: {
			all: {
				files: {
					'public/js/bundle.js': 'public/app/index.js'
				},
				options: {
					transform: ['reactify']
				}
			}
		},
		watch: {
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint']
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['browserify']
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['stylus']
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					ext: 'js,html',
					watch: watchFiles.serverJS,
					ignore: watchFiles.clientJS
				}
			},			
			debug: {
				script: 'app.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverJS,
					ignore: watchFiles.clientJS
				}
			}
		},
		'node-inspector': {
			dev: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		concurrent: {
			options: {
				logConcurrentOutput: true,
				limit: 10
			},
			dev: ['watch', 'nodemon:dev'],
			debug: ['watch', 'node-inspector:dev', 'nodemon:debug']
		},
		uglify: {
			all: {
				options: {
					mangle: false,
					beautify: false
				},
				files: {
					'public/js/bundle.js': 'public/js/bundle.js'
				}
			}
		}
	});
	// Load NPM tasks
	require('load-grunt-tasks')(grunt);
	// Default task(s).
	grunt.registerTask('default', ['env', 'jshint', 'concurrent:dev']);
	// Debug task.
	grunt.registerTask('debug', ['env', 'jshint', 'concurrent:debug']);
	// build task(s).
	grunt.registerTask('build', ['jshint', 'stylus', 'browserify', 'uglify']);
};