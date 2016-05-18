/* global module:false */

"use strict";

module.exports = function (grunt) {
    var yeomanConfig;
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    yeomanConfig = {
        src: "src",
        dist: "dist"
    };
    return grunt.initConfig({
        yeoman: yeomanConfig,
        uglify: {
            build: {
                src: ["<%=yeoman.src %>/app.js", "<%=yeoman.src %>/**/*.js"],
                dest: "<%=yeoman.dist %>/bootstrap-angular-validation.min.js"
            }
        },
        bump: {
            options: {
                files: ["package.json"],
                updateConfigs: [],
                commit: true,
                commitMessage: "Release v%VERSION%",
                commitFiles: ["package.json"],
                createTag: true,
                tagName: "v%VERSION%",
                tagMessage: "Version %VERSION%",
                push: true,
                pushTo: "origin",
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
                globalReplace: false,
                prereleaseName: false,
                metadata: "",
                regExp: false
            }
        },
        watch: {
            scripts: {
                files: ["<%=yeoman.src %>/**/*.js"],
                tasks: ["uglify"],
                options: {
                    spawn: false
                }
            }
        }
    }, grunt.registerTask("default", ["uglify"]));
};