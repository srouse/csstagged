

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
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
                // 'client/less/test.less',//fonts there
                'client/less/csstagged.less',//core CTag
                'client/jsx/Shared/html.less',//fonts there
                'client/jsx/Shared/**/*.less',
                'client/jsx/**/Shared/**/*.less',//process shared less first
                'client/jsx/**/*.less',
                'node_modules/nanoscroller/bin/css/nanoscroller.css'
            ]
        }
    }

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

    configObj.css_parse = {
        dist: {
            files: {
                'client/_client/csstagged.json':
                [
                    'client/_client/csscomp.css'
                ]
            }
        }
    };

    configObj.watch = configObj.watch || {};
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
