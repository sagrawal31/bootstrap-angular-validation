/* global module:false */

'use strict';

module.exports = function (grunt) {
  var yeomanConfig;
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  yeomanConfig = {
    src: 'src',
    dist: 'dist'
  };

  var tooltipFile = '<%=yeoman.src %>/services/tooltip.message.service.js';
  var simpleFile = '<%=yeoman.src %>/services/simple.message.service.js';

  return grunt.initConfig({
    yeoman: yeomanConfig,
    uglify: {
      build: {
        files: {
          '<%=yeoman.dist %>/bootstrap-angular-validation-all.min.js': [
            '<%=yeoman.src %>/app.js',
            '<%=yeoman.src %>/**/*.js'
          ],
          '<%=yeoman.dist %>/bootstrap-angular-validation-core.min.js': [
            '<%=yeoman.src %>/app.js',
            '<%=yeoman.src %>/**/*.js',
            ('!' + simpleFile),
            ('!' + tooltipFile)
          ],
          '<%=yeoman.dist %>/bootstrap-angular-validation-simple.min.js': simpleFile,
          '<%=yeoman.dist %>/bootstrap-angular-validation-tooltip.min.js': tooltipFile
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
    watch: {
      scripts: {
        files: ['<%=yeoman.src %>/**/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false
        }
      }
    }
  }, grunt.registerTask('default', ['uglify']));
};