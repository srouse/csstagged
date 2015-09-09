


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

function getTaggedComment ( rule ) {
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
    return false;
}
