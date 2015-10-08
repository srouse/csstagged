





function processComponent ( tagged_rule , returnObj ) {
    var complete_tally = 0;

    var comment_dom = $( tagged_rule.tagged_comment );

    tagged_rule.metadata = {
        global:false,
        complete:false
    };

    returnObj.totals.tagged_rules++;
    returnObj.tagged_rules.push( tagged_rule );
    if ( !returnObj.totals.depths_tagged[ tagged_rule.depth ] )
        returnObj.totals.depths_tagged[ tagged_rule.depth ] = 0;
    returnObj.totals.depths_tagged[ tagged_rule.depth ]++;

    // <TAGS>
    // shouldn't matta which you use...
    var tag = comment_dom.attr("tag");
    var tags = comment_dom.attr("tags");
    var tags_arr = [];
    if ( tags )
        tags_arr.push( tags );
    if ( tag )
        tags_arr.push( tag );
    tagged_rule.metadata.type = tags_arr.join(",");
    if ( tagged_rule.metadata.type ) {
        complete_tally++;
        var type_arr = tagged_rule.metadata.type.split(",");
        var type;
        for ( var t=0; t<type_arr.length; t++ ) {
            type = type_arr[t];
            if ( !returnObj.types_hash[type] ) {
                returnObj.types_hash[type] = [];
            }
            returnObj.types_hash[type].push( tagged_rule );
        }
    }
    // </TAGS>

    // <TEMPLATE>
    if ( $.trim(comment_dom.html()) != "" ) {
        complete_tally++;
        var html = comment_dom.html();
        var html_rebuilt = [];
        var tag_arr = html.split("{");
        var tag_section;
        for ( var t=0; t<tag_arr.length; t++ ) {
            tag_section = tag_arr[t];
            tag_section_arr = tag_section.split("}");
            if ( tag_section_arr.length == 1 ) {
                html_rebuilt.push( tag_section );
            }else{
                html_rebuilt.push(
                    "<div comp='"
                    + $.trim( tag_section_arr[0] )
                    +"'></div>"
                    + $.trim( tag_section_arr[1] )
                );
            }
        }
        tagged_rule.metadata.example = html_rebuilt.join("");
    }
    // </TEMPLATE>

    if ( complete_tally == 2 ) {
        returnObj.totals.tagged_completed++;
        tagged_rule.metadata.complete = true;
    }else{
        returnObj.incomplete_tagged_rules.push( tagged_rule.uuid );
    }

    // global will be pushed into each template
    tagged_rule.metadata.global = comment_dom.attr("global");
    if ( tagged_rule.metadata.global == "true" ) {
        returnObj.global_rules.push( tagged_rule );
        returnObj.url_prefix = comment_dom.attr("url_prefix");

        if ( comment_dom.attr("ignore") )
            returnObj.ignore = comment_dom.attr("ignore").split(",");

        var fonts = comment_dom.attr("fonts");
        if ( fonts ) {
            returnObj.fonts = fonts.split(",");
        }
    }
}
