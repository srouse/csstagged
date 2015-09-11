
// TODO
// - depth...
// - (v2) figure out (only) element type selector clusters
// - (v2) add media...they are being ignored now.

// ISSUES
// - body.state is creating a bunch of root comps
// - combo selectors are perceived as unique ( .dog.brown )
//      "pure" parent lookup could solve this (filter out last parts...":" too)
// - unique feel too restrictive? ...probably not, it will avoid muddy selection

function processRules ( css_dom ) {
    // time to make sure things are not time bloating
    var start = new Date().getTime();

    var rules = css_dom.stylesheet.rules;

    if ( !install_base )
        install_base = "../";

    // initialize needed data...
    var returnObj = {
        install_base:install_base,

        totals:{
            overall:0,
            rules:0,
            rules_extended:0,
            rules_extendee:0,
            name_duplicates:0,
            tagged_rules:0,
            tagged_completed:0,

            extendable:0,
            depths:[],
            depths_rules:[],
            depths_tagged:[],
            selectorStringLengthTotal:0,
            time_to_process:0
        },
        scores:{
            total_tagged_rules:0,
            tagged_completed:0,
            tagged_connected:0,
            unique_names:0,
            overall:0
        },


        selectors:[],
        names:[],
        rules:[],
        tagged_rules:[],
        incomplete_tagged_rules:[],
        states:[],
        pseudos:[],
        depths_all:[],

        extended_rules_hash:{},
        extended_rules:[],
        extendee_rules:[],

        css_dom:[],

        duplicates:[],

        // lookups
        selector_hash:{},
        name_hash:{},
        uuid_hash:{},
        types_hash:{},

        //global rules...
        global_rules:[],
        url_prefix:"",//pulled from the global rules...last one wins
        fonts:[]
    }

    // internal hashes
    var comp_hash = {};
    var rule_hash = {};

    // need 1:1 relationship selector to rule
    var selectors = flattenSelectors( rules );

    // spliting out into rules, states, pseudo
    var rules_states = flattenStates( selectors , returnObj );

    var selectors = rules_states.selectors;
    for ( var r=0; r<selectors.length; r++ ) {
        selector_rule = selectors[r];
        processSelectorRule( selector_rule , returnObj );
        processRule( selector_rule , returnObj );
    }

    var states = rules_states.states;
    var state;
    for ( var r=0; r<states.length; r++ ) {
        state = states[r];
        processState( state , returnObj );
    }

    var pseudos = rules_states.pseudos;
    var pseudo;
    for ( var r=0; r<pseudos.length; r++ ) {
        pseudo = pseudos[r];
        processPseudo( pseudo , returnObj );
    }

    // <CONTEXTUALIZE>
    var selector_rule;
    for ( var r=0; r<returnObj.selectors.length; r++ ) {
        selector_rule = returnObj.selectors[r];
        contextualizeRule( selector_rule , returnObj );
    }
    // </CONTEXTUALIZE>

    // <NAMES>
    var rules_name = processRuleNames ( returnObj.selectors );
    returnObj.names = rules_name.rules_by_name;
    returnObj.name_hash = rules_name.rule_name_hash;

    // now consolidate into single named rules with array of source rules
    // figure out what type of rule it is...
    var name_rule;
    for ( var r=0; r<returnObj.names.length; r++ ) {
        name_rule = returnObj.names[r];
        checkNameRuleForDuplication( name_rule , returnObj );
    }
    // </NAMES>

    scoreDOM( returnObj );

    returnObj.totals.selectorStringLengthTotal =
        returnObj.totals.selectorStringLengthTotal/returnObj.totals.overall;

    console.log( returnObj );

    var end = new Date().getTime();
    var time = end - start;
    returnObj.totals.time_to_process = time;
    return returnObj;
}



    function flattenSelectors ( rules ) {
        var selector;
        var new_rules = [];

        var rule,cloned_rule,selector_arr;
        for ( var r=0; r<rules.length; r++ ) {
            rule = rules[r];

            if ( rule.type == "rule" ) {
                if ( rule.selectors.length > 1 ) {
                    for ( var s=0; s<rule.selectors.length; s++ ) {
                        selector = rule.selectors[s];
                        // make sure it's unique...
                        cloned_rule = JSON.parse(JSON.stringify(rule));
                        cloned_rule.selector = selector;
                        new_rules.push( cloned_rule );
                    }
                }else{
                    rule.selector = rule.selectors[0];
                    new_rules.push( rule );
                }
            }
        }

        // flip them back to rules and process again...
        rules = new_rules;

        // they are split out, now consolidate repeats
        var rule_hash = {};
        var new_rules = [];
        for ( var r=0; r<rules.length; r++ ) {
            rule = rules[r];
            if ( !rule_hash[rule.selector] ) {
                rule_hash[rule.selector] = rule;
                new_rules.push( rule );
                var cloned_rule = JSON.parse(JSON.stringify(rule));
                rule.source = [cloned_rule];
            }else{
                hashed_rule = rule_hash[ rule.selector ];
                hashed_rule.source.push( rule );
            }
        }

        return new_rules;
    }

    function processRuleNames ( rules ) {
        var rule_name_hash = {};
        var rules_by_name = [];
        for ( var r=0; r<rules.length; r++ ) {
            rule = rules[r];
            rule.name = getSelectorName( rule.selector );
            rule.uuid = getRuleUUID( rule );

            if ( !rule_name_hash[rule.name] ) {
                rule_name_hash[rule.name] = rule;
                rules_by_name.push( rule );
            }else{
                var hashed_rule = rule_name_hash[ rule.name ];
                hashed_rule.source.push( rule );
            }
        }

        return {
            rules_by_name:rules_by_name,
            rule_name_hash:rule_name_hash
        };
    }

    function processSelectorRule ( selector_rule , returnObj ) {
        selector_rule.name = getSelectorName( selector_rule.selector );

        // first look to see if there is a root rule
        // a root rule will have this rule's selector first...
        var source_rule;
        var has_root_selector = false;
        for ( var d=0; d<selector_rule.source.length; d++ ) {
            source_rule = selector_rule.source[d];
            if ( source_rule.selectors[0] == selector_rule.selector ) {
                has_root_selector = true;
                break;
            }
        }

        // see if it is tagged...
        var source_rule;
        for ( var d=0; d<selector_rule.source.length; d++ ) {
            source_rule = selector_rule.source[d];
            source_rule.name = selector_rule.name;
            // if this is the root selector, or if there isn't one...
            if (
                !has_root_selector
                || source_rule.selectors[0] == selector_rule.selector
            ) {
                var tagged_comment = getTaggedComment( source_rule );
                if ( tagged_comment ) {
                    selector_rule.tagged_comment = tagged_comment;
                    selector_rule.type = "tagged_rule";
                    break;
                }
            }
        }

        // see if it is extended or an extendee
        selector_rule.is_extended = false;
        selector_rule.extends_rule = false;
        // rule.is_duplicate = false;
        var core_selector = false;
        for ( var d=0; d<selector_rule.source.length; d++ ) {
            source_rule = selector_rule.source[d];
            if ( source_rule.selectors.length > 1 ) {
                var cleaned_first_selector = _getCleanedSelector(
                                                source_rule.selectors[0]
                                            );
                if ( cleaned_first_selector == source_rule.selector ) {
                    if ( selector_rule.is_extended == false ) {
                        returnObj.totals.rules_extended++;
                        returnObj.extended_rules.push( selector_rule );
                        returnObj.extended_rules_hash[
                            selector_rule.selector
                        ] = selector_rule;
                    }
                    selector_rule.is_extended = true;
                }else{
                    if ( selector_rule.extends_rule == false ) {
                        returnObj.totals.rules_extendee++;
                    }
                    returnObj.extendee_rules.push( selector_rule );
                    selector_rule.extends_rule = true;
                }
            }
        }
    }

    function checkNameRuleForDuplication ( name_rule , returnObj ) {
        var core_selector = name_rule.selector;

        for ( var d=0; d<name_rule.source.length; d++ ) {
            source_rule = name_rule.source[d];
            if ( core_selector != source_rule.selector ) {
                var first_selector = source_rule.selectors[0];

                // need one entry that is the same...
                if ( source_rule.selectors.indexOf( core_selector ) == -1 ) {
                // if ( first_selector != core_selector ) {
                    if ( name_rule.name == ".column_List" ) {
                        console.log( {d:name_rule.source} );
                    }
                    name_rule.is_duplicate = true;
                    returnObj.totals.name_duplicates++;
                    returnObj.duplicates.push( name_rule.name );
                    break;
                }
            }
        }

        for ( var d=0; d<name_rule.source.length; d++ ) {
            source_rule = name_rule.source[d];
            source_rule.is_duplicate = name_rule.is_duplicate;
        }

    }

    function contextualizeRule ( rule , returnObj ) {
        // look up if it is a child of another comp
        // b/c it's less it will be in sequence (otherwise, fuck off)
        var selector_lookup = rule.selector.split(" ");
        var selector_lookup_str;
        var parent_rule;
        var index = 0;

        while ( selector_lookup.length > 0 ) {
            selector_lookup.pop();
            selector_lookup_str = selector_lookup.join(" ");

            if ( selector_lookup_str ) {
                parent_rule = returnObj.selector_hash[selector_lookup_str];
                if ( !parent_rule ) {
                    createNewRule ( selector_lookup_str , returnObj );
                }
                parent_rule = returnObj.selector_hash[selector_lookup_str];
                if ( index == 0 ) {// only add to parent...
                    parent_rule.children.push( rule );
                    if ( rule.type == "rule" ) {
                        parent_rule.total_child_rules++;
                    }else if ( rule.type == "tagged_rule" ) {
                        parent_rule.total_child_comps++;
                    }
                    rule.parent_rule_uuid = parent_rule.uuid;
                }
            }
            index++;
        }

        // now if it is a root (single selector), add it to root of DOM
        if ( rule.selector.indexOf(" ") == -1 ) {
            returnObj.css_dom.push( rule );
        }
    }