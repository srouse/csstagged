
function _ruleAndChildToCSSString ( rule , pretty , img_prefix ) {
    var css = [];
    var new_line = "\n";
    if ( !pretty ) {
        new_line = " ";
    }

    css.push(
        new_line,
        this._ruleAndPseudosToCSSString( rule , pretty , img_prefix ),
        new_line
    );

    var child;
    for ( var c=0; c<rule.children.length; c++ ) {
        child = rule.children[c];
        css.push(
            _ruleAndChildToCSSString( child , pretty , img_prefix ),
            new_line
        );
    }

    return css.join("");
}

function _ruleAndPseudosToCSSString ( rule , pretty , img_prefix ) {
    var new_line = "\n";
    if ( !pretty ) {
        new_line = " ";
    }

    var css_str = ruleToCSSString( rule , pretty , img_prefix );

    // pseudos now...(recursive)
    console.log( rule );
    if ( rule.pseudos ) {
        $.each( rule.pseudos , function ( i , pseudo ) {
            css_str += new_line + ruleToCSSString( pseudo , pretty , img_prefix );
        });
    }

    return css_str;
}

function ruleToCSSString ( rule , pretty , img_prefix ) {
    var source;
    var css_str = [];

    if ( !rule || !rule.source || rule.source.length == 0 )
        return "(no source found)";

    for ( var s=0; s<rule.source.length; s++ ) {
        source = rule.source[s];
        css_str.push( _ruleToCSSString( source , pretty , img_prefix ) );
    }

    var new_line = "\n";
    if ( !pretty ) {
        new_line = " ";
    }
    return css_str.join(new_line+new_line);
}

    function _ruleToCSSString ( rule , pretty , img_prefix ) {
        var tab = "\t";
        var new_line = "\n";
        if ( !pretty ) {
            tab = "";
            new_line = " ";
        }

        var all_selectors = rule.selectors.join( "," + new_line );
        var selector = all_selectors;//rule.selector;

        if ( !selector ) {
            return "";
        }

        if ( pretty ) {
            //selector = selector.replace(/ /g, new_line );
        }

        var css = [];
        Array.prototype.push.apply(
            css,
            [selector , new_line , "{", new_line]
        );

        var dec_length = rule.declarations.length;
        var dec;
        for ( var i=0; i<dec_length; i++ ) {
            dec = rule.declarations[i];
            if ( dec.type == "declaration" ) {
                Array.prototype.push.apply(
                    css,
                    [
                        tab ,
                        dec.property, ": ", dec.value,";",
                        new_line
                    ]
                );
            }else if ( dec.type == "comment" && pretty ) {
                Array.prototype.push.apply(
                    css,
                    [
                        tab ,
                        "/*" + dec.comment + "*/",
                        new_line
                    ]
                );
            }
        }
        css.push( "}" );

        var css_str = css.join("");
        if ( img_prefix ) {
            css_str =   css_str.replace(
                            /url\(\"/g, "url(\"" + img_prefix
                        );
            css_str =   css_str.replace(
                            /url\(\'/g, "url(\'" + img_prefix
                        );
        }

        return css_str;
    }
