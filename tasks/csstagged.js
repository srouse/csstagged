'use strict';


var path = require("path");

module.exports = function (grunt) {

    grunt.registerMultiTask('csstagged', 'compile and visualize your less', function () {

		if ( this.files.length < 1 ) {
		    grunt.verbose.warn('Destination not written because no source files were provided.');
	    }

        var file,data_config,src,src_obj,dest;
		for ( var f=0; f<this.files.length; f++ ) {
            file = this.files[f];

            dest = file.dest;

            for ( var s=0; s<file.src.length; s++ ) {
                src = file.src[s];
                if (!grunt.file.exists( src )) {
                    grunt.log.warn('Source file "' + src + '" not found.');
                    return false;
                }
            }

            var dest_root_folder = file.dest;

            //CONCAT
            var concat_options = {};
            var concat_id = 'concat.allfiles_' + f;
            concat_options[ concat_id ] = {
                src: file.src,
                dest: dest_root_folder + "/stylesheet.less"
            }
            require('grunt-contrib-concat/tasks/concat.js')( grunt );
            grunt.config.set( 'concat' , concat_options );
            grunt.task.run( 'concat:' + concat_id );


            //LESS
            var less_options = {};
            var less_id = 'less.allfiles_' + f;
            less_options[ less_id ] = {
                src: [dest_root_folder + "/stylesheet.less"],
                dest: dest_root_folder + "/stylesheet.css",
                options: {
                    plugins: [
                        new (require( '../client/less-plugin-csstagged/index.js' ))()
                    ]
                }
            }
            require('grunt-contrib-less/tasks/less.js')( grunt );
            grunt.config.set( 'less' , less_options );
            grunt.task.run( 'less:' + less_id );


            //CSS DOM
            var css_parse_options = {};
            var css_parse_id = 'css_parse.allfiles_' + f;
            css_parse_options[ css_parse_id ] = {
                src: dest_root_folder + "/stylesheet.css",
                dest: dest_root_folder + "/csstagged.json"
            }
            require('grunt-css-parse/tasks/css_parse.js')( grunt );
            grunt.config.set( 'css_parse' , css_parse_options );
            grunt.task.run( 'css_parse:' + css_parse_id );


            var filename = require.resolve( "../install/csstagged.html" );
            grunt.file.write(
                dest_root_folder + "/csstagged.html",
                grunt.file.read( filename )
            );

            var filename = require.resolve( "../install/styleguide.html" );
            grunt.file.write(
                dest_root_folder + "/styleguide.html",
                grunt.file.read( filename )
            );

            // TODO: this is ugly...need all the files to migrate and I don't
            // know how to get reference to folder right now.
            var assets_filename = require.resolve( "../install/_assets/csstagged.css" );
            var assets_folder = getFolder( assets_filename );
            grunt.file.recurse(  assets_folder ,
                function (abspath, rootdir, subdir, filename ) {
                    grunt.file.copy(
                        assets_folder + "/" + filename,
                        dest_root_folder + "/_assets/" + filename
                    );
                }
            );
        }

    });


    function getFolder ( filepath ) {
        var filepath_arr = filepath.split("/");
        filepath_arr.pop();
        var filepath_folder = filepath_arr.join("/");
        return filepath_folder;
    }
}
