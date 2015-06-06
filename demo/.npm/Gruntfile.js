module.exports = function (grunt) {
    grunt.initConfig({
        watch: {

            /*
             * Watch for changes in your css
             */
            css: {
                files: ['../postcss/**/*.css'],
                tasks: ['postcss:dist'],
                options: {
                    livereload: true
                }
            },

            /*
             * Watch for changes in your JavaScript
             */
            js: {
                files: ['../../src/*.js'],
                options: {
                    reload: true
                }
            },

            /*
             * Watch for changes in your files
             */
            files: {
                files: ['../**/*.{tpl,php,twig,tpl.php,html}'],
                options: {
                    livereload: true
                }
            },

            /*
             * Watch for svg changes
             */
            svg: {
                files: ['../images/src/**/*.svg'],
                tasks: ['svg']
            },
        },


        /*
         * Parse css
         */
        postcss: {
            options: {
                map: true,
                processors: [
                    require('postcss-import')({glob : true}),
                    require('postcss-mixins'),
                    require('postcss-simple-vars'),
                    require('postcss-nested'),
                    require('csswring'),
                    require('autoprefixer-core')({browsers: 'last 1 version'})
                ]
            },
            dist: {
                src: '../postcss/main.css',
                dest: '../css/main.css'
            }
        },


        /*
         * Optimize svg files
         */
        svgmin: {
            options: {
                plugins: [
                    {removeXMLProcInst: false},
                    {removeViewBox: false},
                    {removeUselessStrokeAndFill: false},
                    {convertPathData: {straightCurves: false}}]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '../images/src',
                    src: ['**/*.svg'],
                    dest: '../images/dist/',
                    ext: '.svg'
                }]
            }
        },


        /*
         * Generate seperate svg stylesheet and generate png fallbacks
         */
        grunticon: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '../images/dist/svg',
                        src: ['*.svg','*.png'],
                        dest: '../images/dist/'
                    }
                ],
                options: {
                    embedIcons: true,
                    enhanceSVG : true,
                    pngpath: "/sites/all/themes/placeholder/images/dist/svg/"
                }
            }
        },


        /**
         * Remove files
         */
        clean: {
            options: { force: true },
            svg: {
                src: [ '../images/dist/svg']
            },
        },


        /*
         * Minify JavaScript
         */
        uglify: {
            dev: {
                options: {
                    beautify: true,
                    sourceMap: true
                },
                files: {
                    '../js/plugins.js': ['../js/plugins/**/*.js']
                }
            },
            dist: {
                options: {
                    beautify: false,
                    sourceMap: false
                },
                files: {
                    '../js/plugins.js': ['../js/plugins/**/*.js']
                }
            }
        },


        /*
         * Livereload
         */
        browserSync: {
            bsFiles: {
                src: [
                    "../css/**/*.css", "../*.{tpl,php,twig,tpl.php,html}"
                ]
            },
            options: {
                watchTask: true,
                 server: {
                    baseDir: "./../"
                }
            },
            
        },


        /*
         * Simple notifications
         */
        notify: {
            parsed: {
                options: {
                    enabled: true,
                    message: 'css parsed',
                }
            },
        },

        'ftp-deploy': {
          build: {
            auth: {
              host: 'www.spz.be',
              port: 21,
              authKey: 'key'
            },
            src: '../',
            dest: 'httpdocs',
            exclusions: ['../**/.gitignore', '../.git/**/*', '../**/postcss', '../**/.npm' , '../**/*.psd']
          }
        }
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
    grunt.registerTask('default',   ['watch']);
    grunt.registerTask('build',     ['svg', 'uglify:dist', 'postcss:dist']);
    grunt.registerTask('deploy',     ['build', 'ftp-deploy']);
    grunt.registerTask('svg',       ['clean:svg','svgmin:dist','grunticon:dist']);
};
