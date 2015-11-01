'use strict';


var path = require("path");
var fileSave = require('file-save');



module.exports = function (grunt) {

    grunt.registerMultiTask('csstagged', 'compile and visualize your less', function () {

        console.log( "Hi" );
		if ( this.files.length < 1 ) {
		    grunt.verbose.warn('Destination not written because no source files were provided.');
	    }


        var themeName = this.options().name;
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.config.set('grunt-contrib-concat.dist.options.name', themeName);
        grunt.task.run('grunt-contrib-concat');

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
            //src_obj = require( path.resolve( src ) );
            //protoData.generateData( src_obj );

            //fileSave( path.resolve( dest ) )
            //        .write( protoData.serializedData );
        }

    });

}
