


function findTopMostParent ( uuid , css_info ) {
    var rule = css_info.uuid_hash[ uuid ];
    var parent = rule;
    var count = 0;

    while ( parent.parent_rule_uuid ) {
        parent = css_info.uuid_hash[ parent.parent_rule_uuid ];
    }
    return parent;
}

function _getCleanedSelector ( selector ) {
    var selector_arr = selector.split(" ");
    var selector_ele,selector_ele_arr,first_letter;
    var first_colon,first_dot,selector_base;
    var base_end,new_selector=[];
    for ( var i=0; i<selector_arr.length; i++ ) {
        selector_ele = selector_arr[i];
        //selector_ele_arr = selector_ele.split(".");
        //body.dog .dog.cat .dot.cat.mouse div.dog #dog.cat .dog:hover
        first_letter = selector_ele.slice(0,1);
        first_colon = selector_ele.indexOf( ":" );
        if ( first_colon == -1 )
            first_colon = selector_ele.length;
        first_dot = selector_ele.indexOf( "." , 1 );
        if ( first_dot == -1 )
            first_dot = selector_ele.length;

        base_end = Math.min( first_colon , first_dot );
        selector_base = selector_ele.slice( 0 , base_end );
        new_selector.push( selector_base );
    }
    return new_selector.join(" ");
}

function getSelectorName ( selector ) {
    var selector_arr = selector.split(" ");
    return selector_arr.pop();
}

function getRuleUUID ( rule ) {
    if ( !rule || !rule.selector ) {
        console.log("ERROR: getRuleUUID");
        return "-1";
    }
    return ( rule.selector.hashCode() + "" ).replace("-","n");
}


function getTaggedCommentInfo ( rule ) {
    var ctag_count = 0;
    var ctag_info = {};
    var prop;

    for ( var i=0; i<rule.declarations.length; i++ ) {
        declaration = rule.declarations[i];

        if (
            declaration.type == "declaration" &&
            declaration.property.indexOf("-ctag") == 0
        ) {

            var prop = declaration.property.slice(6);
            if ( prop == "example" && rule.name ) {
                var clean_name = rule.name.replace(/\./,"");
                var process_example =
                    declaration.value.replace(
                        "...","class='"+clean_name+"'"
                    );
                process_example = process_example.substring(1, process_example.length-1);
                process_example = $.trim( process_example );
                ctag_info[ prop ] = process_example;
            }else{
                ctag_info[ prop ] = declaration.value;
            }
            ctag_count++;
        }
    }

    if ( ctag_count == 0 ) {
        return false;
    }else{
        return ctag_info;
    }
}

function getTaggedComment ( rule ) {
    var declaration;

    // some legacy...-ctag-tags:"a,b" should be new format
    // any "-ctag"s will force the comment version to be ignored.

    var ctag_info = getTaggedCommentInfo( rule );

    rule.ctag_info = ctag_info;

    if ( ctag_info == false ) {
        for ( var i=0; i<rule.declarations.length; i++ ) {
            declaration = rule.declarations[i];
            if ( declaration.type == "comment" ) {
                // one replacement "..." changes to class='name'
                // ":hover" will still not work...
                var clean_name = rule.name.replace(/\./,"");
                var processed_comment =
                    declaration.comment.replace(
                        "...","class='"+clean_name+"'"
                    );
                var trimmed_comment = $.trim( processed_comment );
                if ( trimmed_comment.indexOf("<csstag") == 0 ) {
                    return processed_comment;
                    break;
                }
            }
        }
    }else{
        var comment_str = "<csstag";
        if ( ctag_info['global'] )
            comment_str += ' global=' + ctag_info['global'];
        if ( ctag_info['tags'] )
            comment_str += ' tags=' + ctag_info['tags'];
        if ( ctag_info['tag'] )
            comment_str += ' tag=' + ctag_info['tag'];
        if ( ctag_info['ignore'] )
            comment_str += ' ignore=' + ctag_info['ignore'];
        if ( ctag_info['url_prefix'] )
            comment_str += ' url_prefix=' + ctag_info['url_prefix'];

        comment_str += ">";
        if ( ctag_info['example'] )
            comment_str += ctag_info['example'];

        comment_str += "</csstag>";
        return comment_str;
    }

    return false;
}
