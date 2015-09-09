

function flattenStates ( rules , returnObj ) {
    var selector;
    var new_rules = [];
    var states = [];
    var pseudos = [];
    var rule,is_state;
    for ( var r=0; r<rules.length; r++ ) {
        rule = rules[r];
        is_state = _checkIfStateOrPseudo( rule );

        if ( is_state == "state" ) {
            states.push( rule );
        }else if ( is_state == "pseudo" ) {
            pseudos.push( rule );
        }else{
            new_rules.push( rule );
        }
    }
    return {
        selectors:new_rules,
        states:states,
        pseudos:pseudos
    };
}

function _checkIfStateOrPseudo ( rule ) {
    // States are...anything with joined selectors:
    // .dog.cat
    // .dog.cat .figure
    // p.active li
    // #me.soiled .frog
    // .dog:hover
    // .dog:hover .cat
    // They get added to the rule that they are a variation of...
    // (both of them)

    var selector_arr = rule.selector.split(" ");
    var selector;
    var hash_count,colon_count,dot_count;
    var first_dot,first_hash;
    for ( var i=0; i<selector_arr.length; i++ ){
        selector = selector_arr[i];
        hash_count = selector.split("#").length - 1;
        colon_count = selector.split(":").length - 1;
        dot_count = selector.split(".").length - 1;

        first_dot = selector.indexOf(".");
        first_hash = selector.indexOf("#");

        if ( colon_count > 0 ) // .dot:hover
        {
            return "pseudo";
            break;
        }

        if ( dot_count > 1 ) { // .dot.cat
            return "state";
            break;
        }
        if ( hash_count == 1 // #dog.cat
            && dot_count > 0
        ) {
            return "state";
            break;
        }
        if ( first_dot > 0 ) { // p.dog
            return "state";
            break;
        }
        if ( first_hash > 0 ) { // p#dog
            return "state";
            break;
        }
    }
    return "rule";
}

function processState ( state , returnObj ) {
    state.type = "state";
    state.state_info = {};
    state.state_info = _getRuleAndStateInfo( state );
    returnObj.states.push( state );

    // now add the state to the right rule...
    var rule_cumulative = [],rule_cumulative_str;
    var focused_state, rule;
    $.each( state.state_info.rules_by_index ,
        function ( index , focused_rule ) {
            focused_state = state.state_info.states_by_index[ index ];
            rule_cumulative.push( focused_rule );
            if ( focused_state.length > 0 ) {
                rule_cumulative_str = rule_cumulative.join(" ");
                if (
                    rule_cumulative_str.indexOf("body") != 0
                    && rule_cumulative_str.indexOf("html") != 0
                ) {
                    rule = returnObj.selector_hash[ rule_cumulative_str ];
                    if ( !rule ) {
                        rule = createNewRule ( rule_cumulative_str , returnObj );
                    }
                    rule.states.push( state );
                }
            }
        }
    );
}

function processPseudo ( pseudo , returnObj ) {
    pseudo.type = "pseudo";
    pseudo.pseudo_info = {};
    pseudo.pseudo_info = _getRuleAndStateInfo( pseudo );
    returnObj.pseudos.push( pseudo );

    // now add the state to the right rule...
    var rule_cumulative = [],rule_cumulative_str;
    var focused_pseudo, rule;
    $.each( pseudo.pseudo_info.rules_by_index ,
        function ( index , focused_rule ) {
            focused_pseudo = pseudo.pseudo_info.states_by_index[ index ];
            rule_cumulative.push( focused_rule );
            if ( focused_pseudo.length > 0 ) {
                rule_cumulative_str = rule_cumulative.join(" ");
                rule = returnObj.selector_hash[ rule_cumulative_str ];
                if ( !rule ) {
                    rule = createNewRule ( rule_cumulative_str , returnObj );
                }
                rule.pseudos.push( pseudo );
            }
        }
    );
}

    function _getRuleAndStateInfo ( state )
    {
        var sel_arr = state.selector.split(" ");
        var sel;
        var states_by_index = [];
        var rules_by_index = [];
        for ( var i=0; i<sel_arr.length; i++ ) {
            sel = sel_arr[i];
            sel = sel.replace(/\./g, "|." );
            sel = sel.replace(/:/g, "|:" );
            sel = sel.replace(/#/g, "|#" );
            sel_sub_arr = sel.split("|");

            if ( sel_sub_arr[0].length == 0 ) {
                sel_sub_arr.shift();
            }
            sel_arr.splice( i , 1 , sel_sub_arr[0] );
            rules_by_index.push( sel_sub_arr[0] );

            if ( sel_sub_arr.length > 1 ) {
                sel_sub_arr.shift();
                states_by_index[i] = sel_sub_arr.join("");
            }else{
                states_by_index[i] = "";
            }
        }
        return {
            rule_selector:sel_arr.join(" "),
            states_by_index:states_by_index,
            rules_by_index:rules_by_index
        }
    }

    function _allPossibleRules ( selector ) {
        var sel_arr = selector.split(" ");
        var sel;
        for ( var i=0; i<sel_arr.length; i++ ) {
            sel = sel_arr[i];
            sel = sel.replace(/\./g, "|." );
            sel = sel.replace(/:/g, "|:" );
            sel = sel.replace(/#/g, "|#" );
            sel_sub_arr = sel.split("|");
            sel_arr.splice( i , 1 , sel_sub_arr );
        }

        // now traverse all all the possibles.
        var all_rules = [""];
        for ( var i=0; i<sel_arr.length; i++ ) {
            name_arr = sel_arr[i];
            all_rules = _arrayOfPossibleRules(name_arr , all_rules );
        }

        return all_rules;
    }
        function _arrayOfPossibleRules ( name_arr , all_rules ) {
            //var all_selectors = [];
            var name,all_rules,new_rules;
            var new_all_rules = [];
            for ( var i=0; i<name_arr.length; i++ ) {
                name = name_arr[i];
                if (
                    name.length > 0
                    && name.indexOf(":") != 0
                ) {
                    new_rules = all_rules.slice(0);
                    for ( var n=0; n<new_rules.length; n++ ) {
                        var new_rule_value = new_rules[n];
                        if ( new_rule_value.length > 0 ) {
                            new_rules[n] = new_rules[n] + " " + name;
                        }else{
                            new_rules[n] = name;
                        }
                    }
                    new_all_rules = new_all_rules.concat( new_rules );
                }
            }
            return new_all_rules;
        }
