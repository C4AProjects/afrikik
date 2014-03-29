module.exports = function(grunt) {

    // configurable paths
    var yeomanConfig = {
        app: 'public/js',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        watch: {
            html: {
                files: ['public/app/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/app/scripts/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**', 'public/sass/**'],
                tasks: ['compass'],
                options: {
                    livereload: true,
                },
            }
        },
        jshint: {
            all: ['gruntfile.js']
        },
        compass: { // Task
            dist: { // Target
                options: { // Target options
                    sassDir: 'public/sass',
                    cssDir: 'public/css',
                    environment: 'production'
                }
            },
            dev: { // Another target
                options: {
                    sassDir: 'public/sass',
                    cssDir: 'public/css'
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: ["NODE_ENV=development"],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app', 'config','mailer'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 2014,
                        NODE_ENV:"development"
                    },
                    cwd: __dirname
                }
            },
            exec: {
                options: {
                    exec: 'less'
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'compass', 'concurrent:target']);
};