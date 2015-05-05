module.exports = function (grunt) {
  grunt.initConfig({
    watch: {


      /*
       * Watch for changes in your css
       */
      css: {
        files: ['**/*{.tpl,.html,.js}'],
        options: {
          livereload: true
        }
      },
    },
  });


  /*
   * include all grunt tasks
   */
  require('load-grunt-tasks')(grunt);


  /*
   * default taks
   */
  grunt.registerTask('default', ['watch']);
};
