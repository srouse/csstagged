'use strict';


var path = require("path");
var fileSave = require('file-save');

var extendGruntPlugin = require('extend-grunt-plugin');


module.exports = function (grunt) {

    grunt.registerMultiTask('csstagged', 'compile and visualize your less', function () {

        console.log( "Hi" );
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

                console.log( src );
            }

            var dest_arr = file.dest.split(".");
            dest_arr.pop();
            var dest_root = dest_arr.join(".");
            console.log( "ROOT:" + dest_root );

            //CONCAT
            var concat_options = {};
            var concat_id = 'concat.allfiles_' + f;
            concat_options[ concat_id ] = {
                src: file.src,
                dest: dest_root + ".less"
            }
            require('grunt-contrib-concat/tasks/concat.js')( grunt );
            grunt.config.set( 'concat' , concat_options );
            grunt.task.run( 'concat:' + concat_id );

            //LESS
            var less_options = {};
            var less_id = 'less.allfiles_' + f;
            less_options[ less_id ] = {
                src: [dest_root + ".less"],
                dest: dest_root + ".css",
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

            //require('grunt-css-parse/tasks/css_parse.js')( grunt );
            /*var concat_options = {};
            var concat_id = 'concat.allfiles_' + f;
            concat_options[ concat_id ] = {
                src: file.src,
                dest: dest_root + ".less"
            }
            require('grunt-contrib-concat/tasks/concat.js')( grunt );
            grunt.config.set( 'concat' , concat_options );
            grunt.task.run( 'concat:' + concat_id );*/


            //src_obj = require( path.resolve( src ) );
            //protoData.generateData( src_obj );

            //fileSave( path.resolve( dest ) )
            //        .write( protoData.serializedData );
        }

    });

}
