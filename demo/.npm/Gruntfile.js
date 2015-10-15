module.exports = function (grunt) {

    grunt.initConfig({


        /**
         * Set base path
         */
        path: '../',
        domain: 'priority.dev',


        watch: {

            /*
             * Watch for changes in your scss
             */
            scss: {
                files: ['<%= path %>scss/**/*.scss'],
                tasks: ['sass:dev','postcss:dev']
            },
        },


        /*
         * Parse css
         */
        sass: {
            dev: {
                options: {
                    sourceMap: true,
                },
                files: {
                    '<%= path %>css/main.css': '<%= path %>scss/main.scss',
                    '<%= path %>css/legacy.css': '<%= path %>scss/legacy.scss'
                }
            },
            dist: {
                options: {
                    sourceMap: false,
                },
                files: {
                    '<%= path %>css/main.css': '<%= path %>scss/main.scss',
                    '<%= path %>css/legacy.css': '<%= path %>scss/legacy.scss'
                }
            }
        },


        /*
         * Post process css
         */
        postcss: {
            dev: {
                files: {
                    '<%= path %>css/main.css': ['<%= path %>css/main.css'],
                    '<%= path %>css/legacy.css': '<%= path %>css/legacy.css'
                },
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({browsers: 'last 4 version'})
                    ]
                }
            },
            dist: {
                files: {
                    '<%= path %>css/main.css': ['<%= path %>css/main.css'],
                    '<%= path %>css/legacy.css': '<%= path %>css/legacy.css'
                },
                options: {
                    map: false,
                    processors: [
                        require('autoprefixer')({browsers: 'last 4 version'}),
                    ]
                }
            }
        },


        /*
         * Livereload
         */
        browserSync: {
            bsFiles: {
                src: [
                    "<%= path %>css/*.css", "<%= path %>**/*.tpl.php"
                ]
            },

            options: {
                watchTask: true,
                proxy: '<%= domain %>' //192.168.33.10
            }
        },

    });


    /*
     * include all grunt tasks
     */
    require('jit-grunt')(grunt);


    /*
     * Stacktrace
     */
    grunt.option('stack', true);


    /*
     * default taks
     */
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('css', ['sass:dev', 'postcss:dev']);
    grunt.registerTask('build', ['postcss:dist']);
};
