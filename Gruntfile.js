module.exports = function(grunt) {

    "use strict";

    // Load grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    // Project configuration.
    grunt.initConfig({

        config: {
            src: "src",
            dist: "dist"
        },

        pkg: require("./package"),

        meta: {
            banner: "/*! <%= pkg.name %> - v<%= pkg.version %> | " +
            "(c) <%= grunt.template.today('yyyy') %> @gijsroge | " +
            "<%= pkg.license.type %> license | <%= pkg.homepage %> */\n"
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            jshint: {
                files: "<%= config.src %>/{,*/}*.js",
                tasks: ["jshint"]
            },

            concat: {
                files: "<%= config.src %>/{,*/}*.js",
                tasks: ["concat:dist", "uglify:dist"]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            all: [
                "Gruntfile.js",
                "<%= config.src %>/{,*/}*.js"
            ],
        },

        // Prepend a banner to the files
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: ["<%= config.src %>/tabtab.js"],
                dest: "<%= config.dist %>/tabtab.js"
            }
        },

        // Generate a minified version
        uglify: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: ["<%= config.dist %>/tabtab.js"],
                dest: "<%= config.dist %>/tabtab.min.js"
            }
        },

        // Increment version
        bump: {
            options: {
                files: [
                    "bower.json",
                    "package.json",
                    "tabtab.jquery.json"
                ],
                updateConfigs: ["pkg"],
                commitMessage: "v%VERSION%",
                commitFiles: [
                    "bower.json",
                    "package.json",
                    "dist"
                ],
                createTag: false,
                push: true,
                pushTo: "origin master"
            }
        },

        //create package
        compress: {
            main: {
                options: {
                    archive: "<%= pkg.name %>-v<%= pkg.version %>.zip"
                },
                expand: true,
                cwd: "<%= config.dist %>/",
                src: ["**/*"],
                dest: "/"
            }
        }
    });

    // Build task
    grunt.registerTask("build", ["jshint", "concat:dist", "uglify:dist"]);

    // Release task
    grunt.registerTask("release", [
        "bump-only",
        "build",
        "compress:main",
        "bump-commit"
    ]);
};
