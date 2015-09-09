

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css-parse');
    grunt.loadNpmTasks('grunt-react');

    var configObj = {
        pkg: '<json:package.json>'
    };

    configObj.react = configObj.react || {};
    configObj.react["csscomp"] = {
        files: {
            'client/_client/csscomp.js':
            'client/**/*.jsx'
        }
    };

    configObj.concat = configObj.concat || {};
    configObj.concat["csscomp"] = {
        files: {
            'client/_client/csscomp.less':
            [
                'client/jsx/Shared/html.less',//fonts there
                'client/jsx/Shared/**/*.less',
                'client/jsx/**/Shared/**/*.less',//process shared less first
                'client/jsx/**/*.less',
            ]
        }
    }

    configObj.less = configObj.less || {};
    configObj.less["csscomp"] = {
        files: {
            'client/_client/csscomp.css':
            [
                'client/_client/csscomp.less'
            ]
        }
    };

    configObj.css_parse = {
        dist: {
            files: {
                'client/csstagged.json':
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

    configObj.watch["react"] = {
        files:[
            'client/**/*.jsx',
            'client/**/*.less'
        ],
        tasks: ["default"]
    };

    grunt.initConfig( configObj );

    // 'build' was put together in processProjects
    grunt.registerTask( 'default' , [
        'concat:csscomp',
        'less:csscomp',
        'react',
        'css_parse'
    ] );

}
