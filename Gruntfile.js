

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
    configObj.react["csstagged"] = {
        files: {
            'install/_assets/csstagged.js':
            'client/**/*.jsx'
        }
    };

    configObj.concat = configObj.concat || {};
    configObj.concat["csstagged"] = {
        files: {
            'install/_assets/csstagged.less':
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
    configObj.less["csstagged"] = {
        options: {
            plugins: [
                new (require('./client/less-plugin-csstagged/index.js'))()
            ]
        },
        files: {
            'install/_assets/csstagged.css':
            [
                'install/_assets/csstagged.less'
            ]
        }
    };

    configObj.css_parse = {
        dist: {
            files: {
                'install/csstagged.json':
                [
                    'install/_assets/csstagged.css'
                    //'install/csstagged_bootstrap.css'
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

    /*==========================
    Final Packages
    ==========================*/
    configObj.concat = configObj.concat || {};
    configObj.concat["final_js"] = {
        files: {
            'install/_assets/csstagged.js':
            [
                "node_modules/jquery/dist/jquery.min.js",
                "node_modules/routestate/RouteState.js",
                "node_modules/raphael/raphael-min.js",
                "node_modules/react/dist/react.js",
                "node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js",

                "client/libs/Hashes.js",
                "client/libs/CTagCircles.js",
                "client/libs/RuleUtil.js",
                "client/libs/vkbeautify.0.99.00.beta.js",

                "client/csstagging_rules.js",
                "client/csstagging_tagged.js",
                "client/csstagging_states.js",
                "client/csstagging_scores.js",
                "client/csstagging_serializers.js",
                "client/csstagging_utils.js",
                "client/csstagging.js",
                "install/_assets/csstagged.js"
            ]
        }
    };
    configObj.concat["final_css"] = {
        files: {
            'install/_assets/csstagged.css':
            [
                "node_modules/nanoscroller/bin/css/nanoscroller.css",
                "install/_assets/csstagged.css"
            ]
        }
    };



    grunt.initConfig( configObj );

    // 'build' was put together in processProjects
    grunt.registerTask( 'default' , [
        'concat:csstagged',
        'less:csstagged',
        'react',
        'css_parse',
        'concat:final_js',
        'concat:final_css'
    ] );

}
