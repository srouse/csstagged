module.exports = function(less) {

    var invalidCTags = ["metadata", "definitions","variables","original_value","extends","order"];


    function CSSTaggedPlugin(options) {
        this._options = options;
        this._visitor = new less.visitors.Visitor(this);
    };

    CSSTaggedPlugin.prototype = {
        isReplacing: true,
        isPreEvalVistor: true,
        debug:false,
        order:0,


        run: function (root) {
            return this._visitor.visit(root);
        },


        debug: function ( msg ) {
            console.log( msg );
        },

        isArray: function ( variable ) {
            return variable instanceof Array;
        },

        cleanComment: function ( content ) {
            if (
                content.indexOf( "'" ) == 0 ||
                content.indexOf( "\"" ) == 0
            ) {
                content = content.slice( 1 );
            }

            var content_end = content.length-1;
            if (
                content.lastIndexOf( ";" ) == content_end
            ) {
                content = content.slice( 0 , -1 );
            }

            content_end = content.length-1;
            if (
                content.lastIndexOf( "'" ) == content_end ||
                content.lastIndexOf( "\"" ) == content_end
            ) {
                content = content.slice( 0 , -1 );
            }

            content = content.replace( /\n/g , "" );
            return content;
        },


        getName: function ( rule ) {
            if ( this.isArray( rule.name ) ) {
                return rule.name[0].value;
            }else{
                return rule.name;
            }
        },
        getProcessedValue: function ( rule ) {
            if (
                rule.value &&
                this.isArray( rule.value.value ) &&
                this.isArray( rule.value.value[0].value )
            ) {
                var rule_value = rule.value.value[0].value[0];
                var rule_name = this.getName( rule );
                if (
                    this.isVariable( rule_value ) ||
                    this.isOperation( rule_value ) ||
                    this.isDefinition( rule_name, rule_value )
                ) {
                    return rule_value;
                }
            }
            return false;
        },




        isUnitValue: function ( rule_value ) {
            if (
                !this.isVariable( rule_value ) &&
                !this.isOperation( rule_value ) &&
                !this.isColor( rule_value ) &&
                typeof rule_value.value !== 'undefined' &&
                !this.isArray( rule_value ) &&
                typeof rule_value.value !== 'object'
            ) {
                return true;
            }else{
                return false;
            }
        },
        isColor: function ( rule_value ) {
            if ( rule_value.rgb ) {
                return true;
            }else{
                return false;
            }
        },
        isRGBColor: function ( rule_value ) {
            if (
                rule_value.name &&
                rule_value.name == "rgba"
            ) {
                return true;
            }else{
                return false;
            }
        },
        isImage: function ( rule_value ) {
            if (
                rule_value.name &&
                rule_value.name == "image"
            ) {
                return true;
            }else{
                return false;
            }
        },
        isVariable: function ( rule_value ) {
            if (
                rule_value &&
                rule_value.name &&
                rule_value.name.indexOf("@") == 0
            ) {
                return true;
            }else{
                return false;
            }
        },
        isDefinition: function ( rule_name , rule_value ) {
            if (
                rule_name &&
                rule_name.indexOf("@") == 0
            ) {
                return true;
            }else{
                return false;
            }
        },
        isOperation: function ( rule_value ) {
            return rule_value.op || rule_value.parens;
        },

        isCTag: function ( rule_name ) {
            if (
                rule_name &&
                rule_name.indexOf("-ctag") == 0
            ) {
                return true;
            }else{
                return false;
            }
        },
            createCTag: function ( ctag_name , ctag_value, metadata ) {
                var ctag_name = ctag_name.slice(6);
                if ( typeof ctag_value == "string" ) {
                    ctag_value = ctag_value.trim();
                    ctag_value = this.cleanComment( ctag_value );
                }

                if ( ctag_name == "examplessss" )
                        console.log( ctag_value );

                ctag_value = this.valueToString( metadata , ctag_name, ctag_value );

                if ( ctag_name == "tag" ) {
                    ctag_name = "tags";
                }

                if (
                    ctag_name == "description" ||
                    ctag_name == "title"
                ) {
                    ctag_value = {
                        definitions_index:this.definitions_count,
                        content:ctag_value.trim()
                    };
                }

                if ( typeof metadata[ ctag_name ] == "undefined" ) {
                    if (
                        ctag_name == "description" ||
                        ctag_name == "title"
                    ) {
                        metadata[ ctag_name ] = [ctag_value];
                    }else{
                        metadata[ ctag_name ] = ctag_value;
                    }
                    return;
                }else if ( invalidCTags.indexOf( ctag_name ) != -1 ) {
                    console.log( "invalid -ctag-" + ctag_name );
                    return;
                }else if ( !this.isArray( metadata[ ctag_name ] ) ) {
                    metadata[ ctag_name ] = [metadata[ ctag_name ]];
                }

                metadata[ ctag_name ].push( ctag_value );
            },



        isProcessedValue: function ( rule ) {
            return this.getProcessedValue( rule );
        },
        isMixin: function ( rule ) {
            return rule.arguments;
        },
        isExtend: function ( rule ) {
            return rule.parent_ids;
        },
        isCSSFunction: function ( rule ) {
            return rule.name && rule.args;
        },
        isPointer: function ( rule ) {
            return rule.selector;
        },

        removeCommentFromCSS: function ( rule ) {
            rule.isLineComment = true;
            rule.value = '';
        },


        captureVariable: function ( metadata , rule_name , rule_value ) {
            if ( this.isVariable( rule_value ) ) {
                var var_name = rule_value.name;
                if ( !metadata.variables[ rule_name ] ) {
                    metadata.variables[ rule_name ] = [];
                }
                metadata.variables[ rule_name ].push( var_name );
            }else{
                this.debug( "not a variable: " + rule_value );
            }
        },



        valueToString: function ( metadata, rule_name , rule_value ) {
            if ( this.isVariable( rule_value ) ) {
                this.captureVariable( metadata , rule_name , rule_value );
                this.debug( "------is variable");
                return rule_value.name;
            }else if ( this.isOperation( rule_value ) ) {
                this.debug( "------is operation");
                return this.operationToString( metadata, rule_name, rule_value );
            }else if ( this.isColor( rule_value ) ) {
                this.debug( "------is color");
                return "rgba(" + rule_value.rgb.join(",") + ","+ rule_value.alpha + ")";
            }else if ( this.isRGBColor( rule_value ) ) {
                var rgb_args = [];
                for ( var a=0; a<rule_value.args.length; a++ ) {
                    rgb_args.push(
                        this.valueToString(
                            metadata, rule_name ,
                            rule_value.args[a].value[0]
                        )
                    );
                }
                this.debug( "------is rgbacolor");
                return "rgba(" + rgb_args.join(",") + ")";
            }else if ( this.isImage( rule_value ) ) {
                return "image( '"+ rule_value.args[0].value.value +  "')";
            }else if ( this.isUnitValue( rule_value ) ) {
                var unit = "";
                if (
                    rule_value.unit &&
                    rule_value.unit.numerator &&
                    rule_value.unit.numerator.length > 0
                ) {
                    unit = rule_value.unit.numerator[0];
                }
                this.debug( "------is simple");
                return rule_value.value + "" + unit;
            }else{
                if ( rule_name == "examplessss" )
                    console.log( rule_value );
                if ( typeof rule_value == "string" ) {
                    return rule_value;
                }
                if ( rule_value.value ) {// might be nested one more time...
                    return this.valueToString( metadata, rule_name , rule_value.value );
                }
                if ( this.isArray( rule_value ) && rule_value.length > 0 ) {
                    return this.valueToString( metadata, rule_name , rule_value[0] );
                }

                this.debug( "------is not found");
                return "not found";
            }
        },

            operationToString: function ( metadata, rule_name, rule_value  ) {
                if ( rule_value.parens ) {
                    var parens_str = this.valueToString(
                                        metadata, rule_name,
                                        rule_value.value[0]
                                    );
                    return "( " +  parens_str  + " )";
                }else{
                    var operation = rule_value.op;
                    var operand_one =   this.valueToString(
                                            metadata, rule_name,
                                            rule_value.operands[0]
                                        );
                    var operand_two =   this.valueToString(
                                            metadata, rule_name,
                                            rule_value.operands[1]
                                        );
                    return operand_one + " " + operation + " " + operand_two;
                }
            },
            mixinToString: function ( metadata, rule_name, rule  ) {
                var arg,arg_str, args=[];
                for ( var a=0; a<rule.arguments.length; a++ ) {
                    arg = rule.arguments[a];
                    arg_str = this.valueToString( metadata, rule_name , arg.value.value[0] );
                    args.push( arg_str );
                }
                return rule.selector.elements[0].value + "( " + args.join(", ") + " )";
            },
            extendToString: function ( metadata, rule_name, rule  ) {
                var ele,ele_arr=[];
                var elements = rule.selector.elements;
                for ( var a=0; a<elements.length; a++ ) {
                    ele = elements[a];
                    ele_arr.push( ele.value );
                }
                return ele_arr.join(" ");
            },

        visitRuleset: function ( node, visitArgs) {
            var first_rule = node.rules[0];
            this.definitions_count = 0;
            // this.debug( JSON.stringify( node ) );
            // this.debug( first_rule );


            var originalRuleset = node.originalRuleset;
            var rules = originalRuleset.rules;
            var total_rules = rules.length;
            var rule,rule_name,rule_value,value,var_name,rule_value_str;
            var metadata={
                    definitions:[],
                    variables:{},original_value:{},
                    extends:[],
                    local:{},
                    pointers:[]
                };
            var variables = metadata.variables;
            var original_value = metadata.original_value;

            for ( var i=0; i < total_rules; i++ ) {
                rule = rules[i];

                if (
                    rule.name &&
                    rule.name.length > 0
                ) {
                    rule_name = this.getName( rule );

                    if ( this.isDefinition( rule_name ) ) {
                        this.debug( "DEFINITION" );
                        rule_value = this.getProcessedValue( rule );
                        if ( rule_value ) {
                            var final_val =
                                this.valueToString(
                                    metadata, rule_name, rule_value
                                );
                            metadata.definitions.push({
                                name:rule_name,
                                value:final_val
                            });
                            this.definitions_count++;
                        }else{
                            this.debug( "no value for definition" );
                        }
                    }else if ( this.isCTag( rule_name ) ) {

                        this.createCTag( rule_name , rule.value.value , metadata );

                    }else if ( this.isProcessedValue( rule ) ) {
                        rule_value = this.getProcessedValue( rule );
                        if ( rule_value ) {
                            rule_value_str = this.valueToString(
                                                metadata, rule_name, rule_value
                                            );
                            original_value[ rule_name ] = rule_value_str;
                            metadata.local[rule_name] = rule_value_str;
                            this.debug( "processed value (" + rule_name + ")");
                        }
                    }else{
                        this.debug( "not a processed value or def (" + rule_name + ")");
                        if ( rule.value ) {
                            metadata.local[rule_name] =
                                            this.valueToString(
                                                metadata, rule_name, rule.value
                                            );
                        }

                    }
                }else{
                    this.debug("DOESNT HAVe a NAME");

                    if ( rule.value ) { // comments
                        this.debug( "------comment");
                        // works for comments as well...
                        var comment_value = rule.value.slice( 2 , -2 ).trim();
                        if (
                            comment_value.indexOf("-ctag") == 0
                        ) {
                            var comment_value_arr = comment_value.split(":");
                            var ctag_name = comment_value_arr.shift();
                            var ctag_value = comment_value_arr.join(":");
                            this.createCTag( ctag_name , ctag_value , metadata );

                            // this.removeCommentFromCSS( rule );
                        }
                    }else if ( rule.rules ) { // a child rule
                        this.debug( "------child...");
                        //this.debug( rule.rules[0].name );
                    }else if ( this.isMixin( rule ) ) {
                        rule_name = "mixin_" + i;
                        original_value[ rule_name ] =
                            this.mixinToString(
                                metadata,
                                rule_name,
                                rule
                            );
                        this.debug( "------mixin");
                    }else if ( this.isExtend( rule ) ) {

                        metadata.extends.push(
                            this.extendToString(
                                metadata,
                                rule_name,
                                rule
                            )
                        );
                        this.debug( "------extend");
                    }else if ( this.isCSSFunction( rule ) ) { // css function
                        this.debug( "OP");
                        original_value[ rule_name ] = "CSS OP";
                        this.debug( "------cssfunk");
                    }else if ( this.isPointer( rule ) ) {
                        if (
                            rule.selector &&
                            rule.selector.elements &&
                            rule.selector.elements[0] &&
                            rule.selector.elements[0].value
                        ) {
                            var pointer_str = [];
                            for ( var a=0; a<rule.selector.elements.length; a++ ) {
                                pointer_str.push( rule.selector.elements[a].value );
                            }

                            metadata.pointers.push(
                                pointer_str.join(" ")
                            );
                        }
                        this.debug( "------pointer");
                    }else{
                        this.debug( "------don't know what it is");
                    }

                }
            }

            // now wipe out the original -ctag properties
            /*var rules = node.rules;
            var total_rules = rules.length;
            for ( var i=0; i < total_rules; i++ ) {
                rule = rules[i];
                rule_name = this.getName( rule );
                if (
                    rule_name &&
                    rule_name.indexOf( "-ctag" ) == 0
                ) {
                    this.removeRuleFromCSS( rule );
                }
            }*/

            metadata.order = this.order;
            this.order++;

            node.rules.push( {
                isLineComment:false,
                value:
                    "/* -ctag-metadata:" + JSON.stringify( metadata ) + "*/"
            });

            //this.debug( metadata );
            /* -ctag-metadata: {
                    variables:{
                        width:['@row','@row-1']
                    },
                    original_value:{
                        width:"@row + @row-1"
                    }
                    extends:['.a .b','.c .d']
            }*/

            return node;
        },

    };
    return CSSTaggedPlugin;
};
