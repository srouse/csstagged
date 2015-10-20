

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-css-parse');

    var configObj = {
        pkg: '<json:package.json>'
    };

    // concat all the less first to sustain relationships.
    // a convention of a folder named "shared" containing base rules will
    // ensure that rules cascade in the correct order
    configObj.concat = configObj.concat || {};
    configObj.concat["csscomp"] = {
        files: {
            'client/_client/comp.less':
            [
                'client/shared/html.less',//fonts there
                'client/shared/**/*.less',
                'client/**/shared/**/*.less',//process shared less first
                'client/**/*.less',
            ]
        }
    }

    // compile the less all together
    // use optional to avoid compile errors
    // @import (optional, reference) "../../shared/global.less";
    configObj.less = configObj.less || {};
    configObj.less["csscomp"] = {
        options: {
            plugins: [
                new (require('./client/less-plugin-csstagged/index.js'))()
            ]
        },
        files: {
            'client/_client/csscomp.css':
            [
                'client/_client/csscomp.less'
            ]
        }
    };

    // parse into the folder containing the csstagged/index.html
    configObj.css_parse = {
        dist: {
            files: {
                'csstagged/csstagged.json':
                [
                    'client/_client/csscomp.css'
                ]
            }
        }
    };

    configObj.watch = configObj.watch || {};
    configObj.watch["css_parse"] = {
        files:[
            "../_client/*.css",
            'client/_client/csscomp.css'
        ],
        tasks: "css_parse"
    };

    grunt.registerTask( 'default' , [
        'concat:csscomp',
        'less:csscomp',
        'css_parse'
    ] );

}
