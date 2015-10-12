/** @jsx React.DOM */

// Create a custom component by calling React.createClass.

var CSSComp = React.createClass({displayName: "CSSComp",

    render: function() {
        return  React.createElement("div", {className: "cssComp"}, 

                    React.createElement("div", {className: "cssComp_columns"}, 
                        React.createElement(ColumnStats, {
                            css_info:  this.props.css_info}), 
                        React.createElement(ColumnComps, {
                            css_info:  this.props.css_info}), 
                        React.createElement(ColumnType, {
                            css_info:  this.props.css_info})
                    ), 
                    React.createElement(RuleDetail, React.__spread({},  this.props)), 
                    React.createElement(StatDetails, React.__spread({},  this.props)), 
                    React.createElement(OverallVisual, {css_info:  this.props.css_info})
                );
    }
});



var ColumnComps = React.createClass({displayName: "ColumnComps",

    render: function() {

        return  React.createElement("div", {className: "columnComps"}, 
                    React.createElement("div", {className: "column_Header"}, 
                        "Root Rules"
                    ), 
                    React.createElement(ColumnCompsList, React.__spread({}, 
                        this.props))
                );

    }

});



var ColumnCompsList = React.createClass({displayName: "ColumnCompsList",

    getInitialState: function(){
        var cssdom = RouteState.route.cssdom;
        if ( typeof RouteState.route.cssdom === 'string' ) {
            cssdom = [RouteState.route.cssdom];
        }

        return {
            cssdom:cssdom
        };
    },

    openRow: function ( uuid ) {
        RouteState.toggle(
            {cssdom:[uuid]},
            {cssdom:["-"+uuid]}
        );
    },

    viewRuleDetail: function ( uuid ) {
        RouteState.toggle(
            {
                tree:uuid,
                rule:uuid,
                detailTab:"example"
            },
            {
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    popUUID: function ( uuid ) {
        RouteState.merge(
            {cssdom:["-"+uuid]}
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"cssdom",
    		function ( route , prev_route ) {
                var cssdom = RouteState.route.cssdom;
                if ( typeof RouteState.route.cssdom === 'string' ) {
                    cssdom = [RouteState.route.cssdom];
                }
                me.setState({
                    cssdom:cssdom
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    componentDidUpdate: function () {
        //nano stuff here

        //$(".nano").nanoScroller();

    },

    _findFocusedDOM : function () {
        var dom = false;
        var dom_children = this.props.css_info.css_dom;

        if (
            this.state.cssdom &&
            this.state.cssdom.length > 0
        ) {
            var dom_uuid = this.state.cssdom[
                                    this.state.cssdom.length-1
                                ];
            var hash_dom = this.props.css_info.uuid_hash[ dom_uuid ];
            if ( hash_dom ) {
                dom = hash_dom;
                dom_children = dom.children;
            }
        }

        return {
            dom:dom,
            dom_array:dom_children
        };
    },

    render: function() {
        var dom_info = this._findFocusedDOM();
        var css_dom = dom_info.dom_array;

        //sort them...
        css_dom.sort(
            function(a, b) {
                // if ( b.children.length == a.children.length ) {
                    var a_name = a.name.toLowerCase();
                    var b_name = b.name.toLowerCase();
                    if (a_name < b_name)
                        return -1;
                    if (a_name > b_name)
                        return 1;
                    return 0;
                // }else{
                //    return b.children.length - a.children.length;
                // }
            }
        );

        list_body_class = "column_ListBody";

        var rows = [];
        var rule;
        var me = this;
        for ( var i=0; i<css_dom.length; i++ ) {
            rule = css_dom[i];
            rows.push(
                React.createElement(ColumnCompsRow, {rule:  rule, 
                    key:  rule.uuid, 
                    onRowClick:  this.openRow, 
                    onDetailClick:  this.viewRuleDetail})
            );
        }

        list_body_class += " nano";

        return  React.createElement("div", {className: "column_List"}, 
                    React.createElement("div", {className:  list_body_class }, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    )
                );

    }
});



var ColumnCompsRow = React.createClass({displayName: "ColumnCompsRow",

    openRow: function ( uuid ) {
        /*RouteState.toggle(
            {cssdom:[uuid]},
            {cssdom:["-"+uuid]}
        );*/
        // this.props.onRowClick( uuid );
        this.props.onDetailClick( uuid );
    },

    viewRuleDetail: function ( uuid ) {
        /*RouteState.toggle(
            {tree:uuid},
            {tree:""}
        );*/
        
        this.props.onDetailClick( uuid );
    },

    render: function() {
        var rule = this.props.rule;

        return React.createElement("div", {className: "column_List_Row", 
                onClick: 
                    this.openRow.bind( this , rule.uuid)
                }, 
                React.createElement("div", {className: "column_rowTitle"}, 
                     rule.name, 
                    React.createElement("div", {className: "column_typeBox"}, 
                        React.createElement(TypeIcon, {rule:  rule })
                    )
                )

            );
    }
});


var ColumnStats = React.createClass({displayName: "ColumnStats",

    componentDidUpdate: function () {
        this.renderCircles();
    },

    componentDidMount: function () {
        this.renderCircles();
    },

    renderCircles : function () {
        CTagCircles.renderAllCircles( $(".tile_circle") );
    },

    showDetails: function ( type ) {
        RouteState.toggle(
            {statDetails:type},
            {statDetails:""}
        )
    },

    render: function() {
        var totals = this.props.css_info.totals;
        var scores = this.props.css_info.scores;

        return  React.createElement("div", {className: "columnStats"}, 
                    React.createElement("div", {className: "columnStats_graph"}, 
                        React.createElement("div", {className: "column_logo"}, 
                            React.createElement("a", {href: "http://www.csstagged.com", 
                                target: "_csstagged"}, 
                                React.createElement("div", {className: "column_logo_img"})
                            )
                        )
                    ), 
                    React.createElement("div", {className: "columnStats_content"}, 
                        React.createElement("div", {className: "columnStats_tile tagged_rules", 
                            onClick: 
                                this.showDetails.bind(
                                    this , "tagged"
                                )
                            }, 
                            React.createElement("div", {className: "tile_graph"}, 
                                React.createElement("div", {className: "tile_circle", 
                                    "data-score": 
                                        Math.round(
                                            totals.tagged_rules /
                                            totals.overall * 100
                                        ), 
                                    
                                    "data-base-color": "#FFE29B", 
                                    "data-score-color": "#79E1DA"}
                                )
                            ), 
                            React.createElement("div", {className: "tile_label"}, 
                                "Tagged Rules", 
                                React.createElement("div", {className: "columnStats_typeBox"}, 
                                    React.createElement(TypeIcon, {rule: {
                                            type:"tagged_rule",
                                            metadata:{complete:false}
                                        }})
                                )
                            )
                        ), 
                        React.createElement("div", {className: "columnStats_tile complete_tags", 
                            onClick: 
                                this.showDetails.bind(
                                    this , "complete"
                                )
                            }, 
                            React.createElement("div", {className: "tile_graph"}, 
                                React.createElement("div", {className: "tile_circle", 
                                    "data-score": 
                                        Math.round(
                                            totals.tagged_completed /
                                            totals.overall * 100
                                        ), 
                                    
                                    "data-score-two": 
                                        Math.round(
                                            ((
                                                totals.tagged_rules
                                            ) / totals.overall ) * 100
                                        ), 
                                    
                                    "data-base-color": "#FFE29B", 
                                    "data-score-color": "#79E1DA", 
                                    "data-score-two-color": "#555"}
                                )
                            ), 
                            React.createElement("div", {className: "tile_label"}, 
                                "Complete Tags", 
                                React.createElement("div", {className: "columnStats_typeBox"}, 
                                    React.createElement(TypeIcon, {rule: {
                                            type:"tagged_rule",
                                            metadata:{complete:true}
                                        }})
                                )
                            )
                        ), 
                        React.createElement("div", {className: "extendable_tile", 
                            onClick: 
                                this.showDetails.bind(
                                    this , "extendable"
                                )
                            }, 
                            React.createElement("div", {className: "tile_graph"}, 
                                React.createElement("div", {className: "tile_circle", 
                                    "data-score": 
                                        Math.round(
                                            (totals.rules_extended /
                                             totals.overall ) * 100
                                        ), 
                                    
                                    "data-score-two": 
                                        Math.round(
                                            (( totals.rules_extendee +
                                            totals.rules_extended ) /
                                            totals.overall) * 100
                                        ), 
                                    
                                    "data-label": 
                                        Math.round(
                                            (
                                                totals.rules_extended /
                                                totals.overall
                                            ) * 100
                                        ) + "%", 
                                    
                                    "data-base-color": "#eee", 
                                    "data-score-color": "#555", 
                                    "data-score-two-color": "#d8d8d8"}
                                )
                            ), 
                            React.createElement("div", {className: "tile_label"}, 
                                "Extended Rules", 
                                React.createElement("div", {className: "columnStats_typeBox"}, 
                                    React.createElement(TypeIcon, {rule: {
                                            type:"tagged_rule",
                                            is_extended:true,
                                            metadata:{complete:true}
                                        }})
                                )
                            )
                        ), 
                        React.createElement("div", {className: "columnStats_tile duplicates", 
                            onClick: 
                                this.showDetails.bind(
                                    this , "duplicates"
                                )
                            }, 
                            React.createElement("div", {className: "tile_graph"}, 
                                React.createElement("div", {className: "tile_circle", 
                                    "data-score": 
                                        Math.round(
                                            totals.name_duplicates
                                            / totals.overall * 100
                                        ), 
                                    
                                    "data-label":  totals.name_duplicates, 
                                    "data-base-color": "#555", 
                                    "data-score-color": "#FF8990"}
                                )
                            ), 
                            React.createElement("div", {className: "tile_label"}, 
                                "Duplicate Names", 
                                React.createElement("div", {className: "columnStats_typeBox"}, 
                                    React.createElement(TypeIcon, {rule: {
                                            type:"tagged_rule",
                                            is_duplicate:true
                                        }})
                                )
                            )
                        )

                    ), 
                    React.createElement("div", {className: "columnStats_depthChart", 
                        onClick:  this.showDetails.bind( this , "depth") }, 
                        React.createElement(DepthChart, React.__spread({},  this.props))
                    )

                );

    }
});




var DepthChart = React.createClass({displayName: "DepthChart",

    render: function() {

        var depths = this.props.css_info.totals.depths;
        var depths_rules = this.props.css_info.totals.depths_rules;
        var depths_tagged = this.props.css_info.totals.depths_tagged;

        var highest_depth = 0;
        var total_depths = depths.length;
        for ( var i=0; i<depths.length; i++ ) {
            highest_depth = Math.max( depths[i] , highest_depth );
        }

        var rows = [];
        for ( var i=0; i<depths.length; i++ ) {
            rows.push(
                React.createElement("div", {className: "depthChart_Column", 
                    style: {width:100/total_depths + "%"}, 
                    key:  i }, 
                    React.createElement("div", {className: "depthChart_Bar"}, 
                        React.createElement("div", {className: "depthChart_RulesBar", 
                            style: {height:
                                ( depths[i]/ highest_depth ) * 100 + '%'
                            }}, 
                            React.createElement("div", {className: "depthChart_label"}, 
                                 depths[i] 
                            )
                        ), 
                        React.createElement("div", {className: "depthChart_CompsBar", 
                            style: {height:
                                ( depths_tagged[i]/ highest_depth ) * 100 + '%'
                            }}
                        )
                    )
                )
            );
        }

        return  React.createElement("div", {className: "depthChart"}, 
                     rows, 
                    React.createElement("div", {className: "depthChart_title"}, "Rule Nesting")
                );

    }

});



var CompleteDetails = React.createClass({displayName: "CompleteDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    close: function(){
        RouteState.merge(
            { statDetails:"" }
        );
    },

    viewRuleDetail: function ( selector ) {
        // want the tree not the rule....
        var rule = this.props.css_info.selector_hash[ selector ];
        var parent = findTopMostParent( rule.uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:rule.uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var me = this;
        var rules = this.props.css_info.incomplete_tagged_rules;
        var rows = [];

        rows.push(
            React.createElement("div", {className: "statDetails_sectionHeader"}, 
                "Incomplete Tagged Rules"
            )
        );

        $.each( rules , function ( i , rule_uuid ) {
            var rule = me.props.css_info.uuid_hash[ rule_uuid ];
            if ( rule ) {
                rows.push(
                    React.createElement("div", {className: "statDetails_row", 
                        onClick: 
                            me.viewRuleDetail.bind( me , rule.selector)
                        }, 
                         rule.name, 
                        React.createElement("div", {className: "statDetails_typeIcon"}, 
                            React.createElement(TypeIcon, {rule:  rule })
                        )
                    )
                );
            }
        });

        return  React.createElement("div", {className: "duplicateDetails"}, 

                    React.createElement("div", {className: "statDetails_columnList nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    ), 

                    React.createElement("div", {className: "statDetails_columnExplanation"}, 
                        React.createElement("div", {className: "statDetails_divider"}), 
                        React.createElement("div", {className: "statDetails_explanation"}, 
                            React.createElement("div", {className: "nano-content"}, 
                                React.createElement("h1", {className: "statDetails_h1"}, 
                                    "Complete Tagged Rules"
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Complete tags will have a tag attribute" + ' ' +
                                    "as well as an example HTML snippet."
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_close", 
                        onClick:  this.close})
                )
    }
});



var DepthDetails = React.createClass({displayName: "DepthDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    close: function(){
        RouteState.merge(
            { statDetails:"" }
        );
    },

    viewRuleDetail: function ( selector ) {
        // want the tree not the rule....
        var rule = this.props.css_info.selector_hash[ selector ];
        var parent = findTopMostParent( rule.uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:rule.uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var me = this;
        var depth_levels = this.props.css_info.depths_all;
        var rows = [];

        var depth_level;
        for ( var d=depth_levels.length-1; d>=4; d-- ) {
            depth_level = depth_levels[d];

            rows.push(
                React.createElement("div", {className: "statDetails_sectionHeader"}, 
                    "Depth ",  d+1
                )
            );

            $.each( depth_level , function ( i , rule_uuid ) {
                var rule = me.props.css_info.uuid_hash[ rule_uuid ];
                if ( rule ) {
                    rows.push(
                        React.createElement("div", {className: "statDetails_row", 
                            onClick: 
                                me.viewRuleDetail.bind( me , rule.selector)
                            }, 
                             rule.name, 
                            React.createElement("div", {className: "statDetails_typeIcon"}, 
                                React.createElement(TypeIcon, {rule:  rule })
                            )
                        )
                    );
                }
            });
        }



        return  React.createElement("div", {className: "depthDetails"}, 

                    React.createElement("div", {className: "statDetails_columnList nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    ), 

                    React.createElement("div", {className: "statDetails_columnExplanation"}, 
                        React.createElement("div", {className: "statDetails_divider"}), 
                        React.createElement("div", {className: "statDetails_explanation"}, 
                            React.createElement("div", {className: "nano-content"}, 
                                React.createElement("h1", {className: "statDetails_h1"}, 
                                    "Rule Depths"
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Nesting/Depth allows for" + ' ' +
                                    "useful relationships and clustering of" + ' ' +
                                    "rules. However, selector nesting can also" + ' ' +
                                    "produce complexity."
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Depths beyond 4 or 5 imply that a stylesheet" + ' ' +
                                    "may be too dense or difficult to understand."
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_close", 
                        onClick:  this.close})
                )
    }
});



var DuplicateDetails = React.createClass({displayName: "DuplicateDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    close: function(){
        RouteState.merge(
            { statDetails:"" }
        );
    },

    viewRuleDetail: function ( selector ) {
        // want the tree not the rule....
        var rule = this.props.css_info.selector_hash[ selector ];
        var parent = findTopMostParent( rule.uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:rule.uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var me = this;
        var rules = this.props.css_info.duplicates;
        var rows = [];
        rows.push(
            React.createElement("div", {className: "statDetails_sectionHeader", 
                key:  "dupDetails_header" }, 
                "Duplicate Names"
            )
        );
        $.each( rules , function ( i , rule_name ) {
            var rule = me.props.css_info.name_hash[ rule_name ];
            if ( rule ) {
                rows.push(
                    React.createElement("div", {className: "statDetails_row", 
                        key:  "dupDetails_" + rule.uuid, 
                        onClick: 
                            me.viewRuleDetail.bind( me , rule.selector)
                        }, 
                         rule.name, 
                        React.createElement("div", {className: "statDetails_typeIcon"}, 
                            React.createElement(TypeIcon, {rule:  rule })
                        )
                    )
                );
            }
        });

        return  React.createElement("div", {className: "duplicateDetails"}, 

                    React.createElement("div", {className: "statDetails_columnList nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    ), 

                    React.createElement("div", {className: "statDetails_columnExplanation"}, 
                        React.createElement("div", {className: "statDetails_divider"}), 
                        React.createElement("div", {className: "statDetails_explanation"}, 
                            React.createElement("div", {className: "nano-content"}, 
                                React.createElement("h1", {className: "statDetails_h1"}, 
                                    "Duplicate Rules"
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Duplicate rules are rules that use the" + ' ' +
                                    "same name (last part of a selector), but" + ' ' +
                                    "in a different area. Duplicates open the" + ' ' +
                                    "possibility of rules colliding. Solutions" + ' ' +
                                    "include using unique names with prefixes or" + ' ' +
                                    "utlizing states (.dog.mutt)."
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_close", 
                        onClick:  this.close})
                )
    }
});



var ExtendableDetails = React.createClass({displayName: "ExtendableDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    close: function(){
        RouteState.merge(
            { statDetails:"" }
        );
    },

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var rules = [];
        var me = this;

        var rows = [];
        rules = this.props.css_info.extended_rules;
        rows.push(
            React.createElement("div", {className: "statDetails_sectionHeader"}, 
                "Extended Rules (Parent)"
            )
        );
        $.each( rules , function ( i , rule_selector ) {
            var rule = me.props.css_info.extended_rules[ i ];
            rows.push(
                React.createElement("div", {className: "statDetails_row", 
                    onClick: 
                        me.viewRuleDetail.bind( me , rule.uuid)
                    }, 
                     rule.name, 
                    React.createElement("div", {className: "statDetails_typeIcon"}, 
                        React.createElement(TypeIcon, {rule:  rule })
                    )
                )
            )
        });

        rules = this.props.css_info.extendee_rules;
        rows.push(
            React.createElement("div", {className: "statDetails_sectionHeader"}, 
                "Rules Extending Other Rules (child)"
            )
        );
        $.each( rules , function ( i , rule_selector ) {
            var rule = me.props.css_info.extendee_rules[ i ];
            rows.push(
                React.createElement("div", {className: "statDetails_row", 
                    onClick: 
                        me.viewRuleDetail.bind( me , rule.uuid)
                    }, 
                     rule.name, 
                    React.createElement("div", {className: "statDetails_typeIcon"}, 
                        React.createElement(TypeIcon, {rule:  rule })
                    )
                )
            )
        });


        return  React.createElement("div", {className: "extendableDetails"}, 

                    React.createElement("div", {className: "statDetails_columnList nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    ), 

                    React.createElement("div", {className: "statDetails_columnExplanation"}, 
                        React.createElement("div", {className: "statDetails_divider"}), 
                        React.createElement("div", {className: "statDetails_explanation nano"}, 
                            React.createElement("div", {className: "nano-content"}, 
                                React.createElement("h1", {className: "statDetails_h1"}, 
                                    "Inheritance"
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "This is a breakdown between rules" + ' ' +
                                    "that have been extended (darkest) to rules" + ' ' +
                                    "that extend other rules (medium) to rules" + ' ' +
                                    "that have no relationships (lightest)."
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Inheritance is determined by rules with" + ' ' +
                                    "multiple selectors" + ' ' +
                                    "( .dog, .cat ... ) with the first" + ' ' +
                                    "selector being the base or parent. Using" + ' ' +
                                    "'&:extend()' in less will create these" + ' ' +
                                    "relationships."
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Too little (or too much) rule reuse" + ' ' +
                                    "and your project will be difficult to maintain." + ' ' +
                                    "The ratio should be roughly 20/50/30" + ' ' +
                                    "( parent / child / unique )."
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_close", 
                        onClick:  this.close})
                )
    }
});



var StatDetails = React.createClass({displayName: "StatDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var rules = [];
        var me = this;

        var comp = React.createElement("div", null);
        if ( this.state.statDetails == "duplicates" ) {
            comp = React.createElement(DuplicateDetails, React.__spread({},  this.props))
        }else if ( this.state.statDetails == "extendable" ) {
            comp = React.createElement(ExtendableDetails, React.__spread({},  this.props));
        }else if ( this.state.statDetails == "depth" ) {
            comp = React.createElement(DepthDetails, React.__spread({},  this.props));
        }else if ( this.state.statDetails == "tagged" ) {
            comp = React.createElement(TaggedDetails, React.__spread({},  this.props));
        }else if ( this.state.statDetails == "complete" ) {
            comp = React.createElement(CompleteDetails, React.__spread({},  this.props));
        }

        return  comp;
    }
});



var TaggedDetails = React.createClass({displayName: "TaggedDetails",

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
    },

    close: function(){
        RouteState.merge(
            { statDetails:"" }
        );
    },

    viewRuleDetail: function ( selector ) {
        // want the tree not the rule....
        var rule = this.props.css_info.selector_hash[ selector ];
        var parent = findTopMostParent( rule.uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:rule.uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:"example"
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"statDetails",
    		function ( route , prev_route ) {
                me.setState({
                    statDetails:route.statDetails
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var me = this;
        var rules = this.props.css_info.rules;
        var rows = [];

        rows.push(
            React.createElement("div", {className: "statDetails_sectionHeader"}, 
                "Untagged Rules"
            )
        );
        $.each( rules , function ( i , rule ) {
            //var rule = me.props.css_info.name_hash[ rule_name ];
            if ( rule ) {
                rows.push(
                    React.createElement("div", {className: "statDetails_row", 
                        onClick: 
                            me.viewRuleDetail.bind( me , rule.selector)
                        }, 
                         rule.name, 
                        React.createElement("div", {className: "statDetails_typeIcon"}, 
                            React.createElement(TypeIcon, {rule:  rule })
                        )
                    )
                );
            }
        });

        return  React.createElement("div", {className: "duplicateDetails"}, 
                    React.createElement("div", {className: "statDetails_columnList nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_columnExplanation"}, 
                        React.createElement("div", {className: "statDetails_divider"}), 
                        React.createElement("div", {className: "statDetails_explanation"}, 
                            React.createElement("div", {className: "nano-content"}, 
                                React.createElement("h1", {className: "statDetails_h1"}, 
                                    "Tagged Rules"
                                ), 
                                React.createElement("p", {className: "statDetails_p"}, 
                                    "Tagged rules are regular CSS rules with" + ' ' +
                                    "some extra metadata tagged via a comment." + ' ' +
                                    "This allows for rules to be clustered by" + ' ' +
                                    "types (buttons, titles, etc) or sections of" + ' ' +
                                    "your application. It also allows for simple" + ' ' +
                                    "examples to be embedded within tags so you" + ' ' +
                                    "can view isolated implementations of the rules." + ' ' +
                                    "The more rules tagged the more useful it is."
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "statDetails_close", 
                        onClick:  this.close})
                )
    }
});



var ColumnType = React.createClass({displayName: "ColumnType",

    render: function() {
        return  React.createElement("div", {className: "columnType"}, 
                    React.createElement("div", {className: "column_Header"}, 
                        "Tags"
                    ), 
                    React.createElement(ColumnTypeList, React.__spread({},  this.props))
                );
    }

});


var ColumnTypeList = React.createClass({displayName: "ColumnTypeList",

    getInitialState: function(){
        return {
            type:RouteState.route.tag
        };
    },

    openRow: function ( tag ) {
        RouteState.toggle(
            {tag:tag,tree:""},
            {tag:"",tree:""}
        );
    },

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid,
                detailTab:"example"
            },
            {
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"type",
    		function ( route , prev_route ) {
                me.setState({
                    type:RouteState.route.type
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    buildRuleList : function () {
        var rows = [];
        var rules = this.props.css_info.types_hash[
                        this.state.type
                    ];

        if ( rules ) {
            var rule;
            for ( var i=0; i<rules.length; i++ ) {
                rule = rules[i];
                rows.push(
                    React.createElement(ColumnCompsRow, {rule:  rule, 
                        key:  rule.uuid, 
                        onRowClick:  this.viewRuleDetail, 
                        onDetailClick:  this.viewRuleDetail})
                );
            }
        }

        return rows;
    },

    buildTypeList : function () {

        var rows = [];
        var types = this.props.css_info.types_hash;

        var types_arr = [];
        for ( var type in types ) {
            types_arr.push( {
                type:type,
                length:types[type].length
            } );
        }

        types_arr.sort(
            function(a, b) {
                if (a.type > b.type) {
                    return 1;
                }
                if (a.type < b.type) {
                    return -1;
                }
                return 0;
            }
        );

        var type_arr;
        var type;
        for ( var t=0; t<types_arr.length; t++ ) {
            type = types_arr[t].type;
            type_arr = types[type];
            rows.push(
                React.createElement("div", {className: "column_List_Row", 
                    key:  type }, 
                    React.createElement("div", {className: "column_rowTitle", 
                        onClick:  this.openRow.bind( this , type) }, 
                         type, 
                        React.createElement("div", {className: "column_rowTotal"}, 
                            
                                ( type_arr.length > 0 ) ?
                                    type_arr.length : ""
                            
                        )
                    )
                )
            );
        }
        return rows;
    },

    render: function() {

        var rows;
        rows = this.buildTypeList();

        return  React.createElement("div", {className: "column_List"}, 
                    React.createElement("div", {className: "column_ListBody nano"}, 
                        React.createElement("div", {className: "nano-content"}, 
                             rows 
                        )
                    )
                );

    }
});


var OverallVisual = React.createClass({displayName: "OverallVisual",

    render: function() {

        var totals = this.props.css_info.totals;
        var comps_percent = Math.round( totals.tagged_rules / totals.overall * 100 );
        var rules_percent = Math.round( totals.rules / totals.overall * 100 );

        var show_tag_labels = ( comps_percent > 10 );

        var rules_percent_dom = [];
        if ( rules_percent > 3 ) {
            rules_percent_dom.push (
                React.createElement("span", {className: "rules_total", 
                    key:  "rules_total" }, 
                     totals.rules
                )
            );
            rules_percent_dom.push (
                React.createElement("span", {className: "rules_percent", 
                    key:  "rules_percent" }, 
                     rules_percent, "%"
                )
            );
        }

        return  React.createElement("div", {className: "overallVisual"}, 
                    React.createElement("div", {className: "cssp_OverallVisual_taggedRules"}, 
                        React.createElement("div", {className: "overallVisual_taggedBar", 
                            style: {width: comps_percent + "%"}}, 
                            React.createElement("span", {className: "tagged_total"}, 
                                 (show_tag_labels) ? totals.tagged_rules : ""
                            ), 
                            React.createElement("span", {className: "tagged_percent"}, 
                                 (show_tag_labels) ? comps_percent +"%" : ""
                            ), 
                            React.createElement("div", {className: "label"}, 
                                 (show_tag_labels) ? "tagged" : ""
                            )
                        ), 
                        React.createElement("div", {className: "overallVisual_rulesBar", 
                            style: {width: rules_percent + "%"}}, 
                             rules_percent_dom 
                        )
                    )
                );
    }
});


var RuleCSS = React.createClass({displayName: "RuleCSS",


    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"react",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_preview"
    	);

        $(".ruleDetail_textarea").each( function () {
            $(this).height( $(this)[0].scrollHeight );
        });
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

    processSelectorIntoHTML: function ( selector ) {
        var rule_arr = selector.split(" ");
        var new_rule_arr = [];
        for ( var i=0; i<rule_arr.length; i++ ) {
            new_rule_arr.push( rule_arr[i] );
            new_rule_arr.push( React.createElement("br", null) );
        }
        return new_rule_arr;
    },

    gotoRule: function ( rule_uuid ) {
        RouteState.merge({tree:rule_uuid});
    },

    toReact: function () {
        RouteState.toggle({react:"react"},{react:""});
    },

    componentDidUpdate: function () {
        $(".ruleDetail_textarea").each( function () {
            $(this).height( 10 );
            $(this).height( $(this)[0].scrollHeight );
        });
    },

    render: function() {
        var rule =  this.props.css_info.uuid_hash[
                        this.props.rule_uuid
                    ];

        var rule = this.props.rule;

        if ( !rule ) {
            return React.createElement("div", null);
        }

        var state_code = [];
        var state_header = "";
        state_header = React.createElement("div", {className: "ruleDetail_title"}, "States");
        if ( rule.states ) {
            $.each( rule.states , function ( index , state ) {
                state_code.push(
                    React.createElement("textarea", {className: "ruleDetail_textarea", 
                        readOnly: true, spellCheck: "false", 
                        key:  "state_" + index, 
                        value:  ruleToCSSString( state , true) }
                    )
                )
            });
        }

        var pseudo_code = [];
        var pseudo_header = "";
        if ( rule.pseudos ) {
            pseudo_header = React.createElement("div", {className: "ruleDetail_title"}, "Pseudo Selectors");
            $.each( rule.pseudos , function ( index , pseudo ) {
                pseudo_code.push(
                    React.createElement("textarea", {className: "ruleDetail_textarea", 
                        readOnly: true, spellCheck: "false", 
                        key:  "pseudo_" + index, 
                        value:  ruleToCSSString( pseudo , true) }
                    )
                )
            });
        }

        var html_obj = RuleUtil.findRuleExample( rule , this.props.css_info , true );
        var html = html_obj.html;
        if ( RouteState.route.react == "react" ) {
            html = html.replace( /class=/gi , "className=");
        }

        return  React.createElement("div", {className: "ruleCSS"}, 
                    React.createElement("div", {className: "ruleDetail_code"}, 
                        React.createElement("div", {className: "ruleDetail_title"}, 
                            "HTML Example", 
                            React.createElement("div", {className: "ruleDetail_titleButton", 
                                onClick:  this.toReact}, "React")
                        ), 
                        React.createElement("textarea", {className: "ruleDetail_textarea", 
                            spellCheck: "false", 
                            readOnly: true, value:  vkbeautify.xml( html) }
                        ), 
                        React.createElement("div", {className: "ruleDetail_title"}, "CSS"), 
                        React.createElement("textarea", {className: "ruleDetail_textarea", 
                            spellCheck: "false", 
                            readOnly: true, value:  ruleToCSSString( rule , true) }
                        ), 
                         pseudo_header, 
                         pseudo_code, 
                         state_header, 
                         state_code 
                    )
                );
    }

});



var RuleDetail = React.createClass({displayName: "RuleDetail",

    getInitialState: function(){
        var rule_uuid = RouteState.route.rule;
        if (
            !rule_uuid
            || rule_uuid == ""
        ) {
            rule_uuid = RouteState.route.tree;
        }

        return {
            tree_rule_uuid:RouteState.route.tree,
            rule_uuid:rule_uuid,
            tag:RouteState.route.tag
        };
    },

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"tree",
    		function ( route , prev_route ) {
                me.setState({
                    tree_rule_uuid:route.tree
                });
    		},
            "rule_detail"
    	);

        RouteState.addDiffListener(
    		"tag",
    		function ( route , prev_route ) {
                me.setState({
                    tag:route.tag
                });
    		},
            "rule_detail"
    	);

        RouteState.addDiffListener(
    		"detailTab",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_detail"
    	);

        var me = this;
        RouteState.addDiffListener(
    		"rule",
    		function ( route , prev_route ) {
                var rule_uuid = route.rule;
                if (
                    !rule_uuid
                    || rule_uuid == ""
                ) {
                    rule_uuid = me.state.tree_uuid;
                }

                me.setState({
                    rule_uuid:rule_uuid
                });
    		},
            "rule_detail"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_detail" );
    },

    change_tab: function ( tab_name ) {
        RouteState.merge(
            {detailTab:tab_name}
        );
    },

    closeDetail: function () {
        RouteState.merge(
            {
                rule:"",detailTab:""
            }
        );
    },

    close: function () {
        RouteState.merge({tree:"",tag:"",rule:"",detailTab:""});
    },

    toRoot: function () {
        RouteState.merge({rule:""});
    },

    render: function() {

        if ( this.state.tag ) {
            var rules_by_tag = this.props.css_info.types_hash[this.state.tag];
            var tree_rule = {
                name:this.state.tag + " (tag)",
                children:rules_by_tag,
                type:"tag"
            }
        }else{
            var tree_rule =  this.props.css_info.uuid_hash[
                            this.state.tree_rule_uuid
                        ];

            if ( !tree_rule )
                tree_rule = {name:"no rule",children:[]};
        }

        var rule =  this.props.css_info.uuid_hash[
                        this.state.rule_uuid
                    ];

        if ( !rule ) {
            rule = tree_rule;
        }

        var content = "";
        if ( RouteState.route.detailTab == "code" ) {
            content = React.createElement(RuleCSS, {
                        css_info:  this.props.css_info, 
                        rule_uuid:  this.state.rule_uuid, 
                        rule:  rule });
        }else if ( RouteState.route.detailTab == "overview" ) {
            content = React.createElement(RuleOverview, {
                        css_info:  this.props.css_info, 
                        rule:  rule });
        }else if ( RouteState.route.detailTab == "example" ) {
            content = React.createElement(RulePreview, {
                        css_info:  this.props.css_info, 
                        rule_uuid:  this.state.rule_uuid, 
                        rule:  rule });
        }

        return  React.createElement("div", {className: "ruleDetail"}, 

                    React.createElement("div", {className: "ruleDetail_header"}, 
                        React.createElement("div", {className: "ruleDetail_title"}, 
                            React.createElement("div", {className: "ruleDetail_close", 
                                onClick:  this.close}), 
                            /* <div className="ruleDetail_titleText"
                                onClick={ this.toRoot }>
                                { tree_rule.name }
                            </div>
                            <div className="ruleDetail_iconBox">
                                <TypeIcon rule={ tree_rule } />
                            </div> */ 
                            React.createElement("div", {className: "ruleDetail_showTree", 
                                onClick:  this.closeDetail})
                        ), 

                        React.createElement("div", {className: "ruleDetail_headerNav"}, 
                            React.createElement("div", {className: "ruleDetail_item_example", 
                                onClick: 
                                    this.change_tab.bind( this , "example")
                                }, 
                                "example"
                            ), 
                            React.createElement("div", {className: "ruleDetail_item_css", 
                                onClick: 
                                    this.change_tab.bind( this , "code")
                                }, 
                                "code"
                            ), 
                            React.createElement("div", {className: "ruleDetail_item_overview", 
                                onClick: 
                                    this.change_tab.bind( this , "overview")
                                }, 
                                "overview"
                            )

                            /*<div className="ruleDetail_back"
                                onClick={ this.close }></div> */ 

                        )
                    ), 

                     content, 

                    React.createElement(RuleNesting, {
                        css_info:  this.props.css_info, 
                        rule:  tree_rule }), 

                    React.createElement(RuleDetailNav, {
                        css_info:  this.props.css_info, 
                        rule_uuid:  this.state.rule_uuid, 
                        rule:  rule })

                );
    }

});


var RuleDetailNav = React.createClass({displayName: "RuleDetailNav",

    gotoRule: function ( rule_uuid ) {
        RouteState.merge({rule:rule_uuid});
    },

    viewRuleDetailViaSelector: function ( selector ) {
        var rule = this.props.css_info.selector_hash[selector];
        if ( rule ) {
            this.viewRuleDetail( rule.uuid );
        }
    },

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid
            },{
                tree:"",
                rule:""
            }
        );
    },

    closeDetail: function () {
        RouteState.merge(
            {
                rule:"",detailTab:""
            }
        );
    },

    render: function() {
        var rule = this.props.rule;

        if ( !rule.name )
            return React.createElement("div", null, "no rule");

        var name = rule.name;
        if ( rule.direct_child_selector ) {
            name = "> " + name;
        }

        return  React.createElement("div", {className: "ruleDetailNav"}, 
                    React.createElement("div", {className: "ruleDetailNav_title"}, 
                        React.createElement("div", {className: "ruleDetailNav_titleText"}, 
                             name 
                        ), 
                        React.createElement("div", {className: "ruleDetailNav_typeIcon"}, 
                            React.createElement(TypeIcon, {rule:  rule })
                        )
                    )
                );
    }

});



var RuleNesting = React.createClass({displayName: "RuleNesting",

    render: function() {
        var rule = this.props.rule;
        if ( !rule )
            return React.createElement("div", null, "no rule found");

        var content =
            React.createElement(RuleNestingColumn, React.__spread({},  this.props, 
                {rule:  rule, index:  0 }));

        return  React.createElement("div", {className: "ruleNesting"}, 
                     content 
                );
    }

});



var RuleNestingColumn = React.createClass({displayName: "RuleNestingColumn",

    maxChildHeight: function ( rule , is_vertical , max_height ) {
        if ( !is_vertical )
            is_vertical = false;

        if ( !rule )
            return 0;

        if ( !max_height )
            max_height = 1;

        if ( !is_vertical ) {
            max_height += Math.max( 0 , rule.children.length-1 );
        }else{
            max_height += Math.max( 0 , rule.children.length );
        }

        var child;
        var child_total = rule.children.length;
        for ( var i=0; i<child_total; i++ ) {
            child = rule.children[i];
            max_height = this.maxChildHeight( child , is_vertical , max_height );
        }

        return max_height;
    },

    gotoRule: function ( rule_uuid ) {
        var detailTab = "example";
        if ( RouteState.route.detailTab ) {
            detailTab = RouteState.route.detailTab;
        }

        RouteState.merge(
            {
                rule:rule_uuid,
                detailTab:detailTab,
                rulestate:""
            }
        );
    },

    render: function() {
        // want the parents as well...
        var rule = this.props.rule;

        if ( !rule )
            return React.createElement("div", null, "no rule");

        var child;
        var children = [];
        var total = rule.children.length;
        var is_last,has_children;
        for ( var i=0; i<total; i++ ) {
            child = rule.children[i];
            children.push(
                React.createElement(RuleNestingColumn, React.__spread({},  this.props, 
                    {key:  "ruleNestingColumn_" + child.uuid, 
                    rule:  child, index:  this.props.index+1}))
            );
        }
        var last_child = rule.children[total-1];

        // HORIZONTAL TREE MAX
        var max_height = this.maxChildHeight( rule );
        var last_child_height = this.maxChildHeight( last_child );
        if ( rule.children.length > 1 ) {
            max_height -= last_child_height-1;
        }
        if ( max_height == 1) {
            max_height = 0;
        }
        if ( rule.children.length == 1 ) {
            max_height = 0;
        }

        // STACKED MAX
        var stack_max_height = this.maxChildHeight( rule , true );
        var last_child_stacked_height = this.maxChildHeight( last_child , true );
        stack_max_height -= last_child_stacked_height;
        if (
            rule.children.length == 0
        ) {
            stack_max_height = 0;
        }

        var extra_class = ( rule.children.length == 0 ) ?
                            " no_children" : "";

        var rule_title = "";
        var extra_title_class = "";
        if ( this.props.index == 0 ) {
            // extra_class += " first_one";
            // extra_title_class += " first_title";
        }

        if ( rule.uuid == RouteState.route.rule )
            extra_title_class += " selected";

        var name = rule.name;
        if ( rule.direct_child_selector ) {
            name = "> " + name;
        }

        rule_title =
            React.createElement("div", {className:  "ruleNestingColumn_title" + extra_title_class, 
                onClick: 
                    this.gotoRule.bind( this , rule.uuid)
                }, 
                React.createElement("div", {className: "ruleNesting_titleText"}, 
                     name 
                ), 
                React.createElement("div", {className: "ruleNesting_typeIcon"}, 
                    React.createElement(TypeIcon, {rule:  rule })
                )
            );


        return  React.createElement("div", {className:  "ruleNestingColumn" + extra_class, 
                    key:  rule.uuid +"-"+ rule.children.length}, 

                    React.createElement("div", {className:  "ruleNestingColumn_line" + extra_class, 
                        style: {height:
                            (( max_height ) * 30 ) + "px"
                        }}
                    ), 

                    React.createElement("div", {className: 
                            "ruleNestingColumn_stackedLine" + extra_class, 
                        
                        style: {height:
                            (( stack_max_height ) * 30 ) + "px"
                        }}
                    ), 

                    React.createElement("div", {className: 
                            "ruleNestingColumn_lineCover" + extra_class
                        }
                    ), 

                     rule_title, 
                    React.createElement("div", {className: 
                            "ruleNestingColumn_children" + extra_class
                        }, 
                         children 
                    ), 

                    React.createElement("div", {style: {clear:"both"}})
                );
    }

});



var RuleOverview = React.createClass({displayName: "RuleOverview",

    gotoRule: function ( rule_uuid ) {
        RouteState.merge({rule:rule_uuid});
    },

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid
            }
        );
    },

    viewRuleDetailViaSelector: function ( selector ) {
        var rule = this.props.css_info.selector_hash[selector];
        if ( rule ) {
            this.viewRuleDetail( rule.uuid );
        }
    },

    render: function() {
        var rule = this.props.rule;

        var children = [];
        var parents = [];
        var states = [];
        var relationships = [];
        var duplicates = [];

        // CHILDRENS
        if ( rule.children ) {
            for ( var r=0; r<rule.children.length; r++ ) {
                var child = rule.children[r];
                children.push(
                    React.createElement("div", {className: "ruleOverview_subName", 
                        key:  "ruleoverview_" + child.uuid, 
                        onClick: 
                            this.gotoRule.bind( this , child.uuid)
                        }, 
                         child.name
                    )
                );

            }
        }

        // PARENTs (SELECTOR)
        var parent = rule;
        var count = 0;
        while ( parent.parent_rule_uuid ) {
            parent = this.props.css_info.uuid_hash[ parent.parent_rule_uuid ];
            if ( parent ) {
                parents.unshift(
                    React.createElement("div", {className: "ruleOverview_subName", 
                        key:  "ruleoverview_parent_" + parent.uuid, 
                        onClick: 
                            this.gotoRule.bind( this , parent.uuid)
                        }, 
                         parent.name
                    )
                );
            }else{
                parent = {parent_rule_uuid:false};
            }
        }
        parents.push(
            React.createElement("div", {className: "ruleOverview_subName", 
                key:  "ruleoverview_rule_" + rule.uuid, 
                onClick: 
                    this.gotoRule.bind( this , rule.uuid)
                }, 
                 rule.name
            )
        );


        var parent_back =
            React.createElement("div", {
                className: "ruleOverview_parentPlaceholder"}
            );

        if ( rule.parent_rule_uuid ) {
            parent = this.props.css_info.uuid_hash[ rule.parent_rule_uuid ];
            parent_back =
                React.createElement("div", {className: "ruleOverview_parentLink", 
                    onClick: 
                        this.gotoRule.bind(
                            this , rule.parent_rule_uuid
                        )
                    }
                );
        }

        // STATES
        if ( rule.states ) {
            for ( var r=0; r<rule.states.length; r++ ) {
                states.push(
                    React.createElement("div", {className: "ruleOverview_stateSubName", 
                        key:  "ruleoverview_state_" + rule.states[r].uuid, 
                        title:  rule.states[r].selector}, 
                         rule.states[r].selector
                    )
                );
            }
        }

        // RELATIONSHIPS
        if ( rule.relationships ) {
            for ( var r=0; r<rule.relationships.length; r++ ) {
                var relationship =  this.props.css_info.selector_hash[
                                        rule.relationships[r]
                                    ];
                if ( relationship ) {
                    relationships.push(
                        React.createElement("div", {className: "ruleOverview_subName", 
                            key:  "ruleoverview_relation_" + relationship.uuid, 
                            onClick: 
                                this.viewRuleDetail.bind( this , relationship.uuid), 
                            title:  relationship.selector}, 
                             relationship.name
                        )
                    );
                }
            }
        }

        // DUPS
        var name_rule = this.props.css_info.name_hash[ rule.name ];
        if ( name_rule && name_rule.is_duplicate ) {
            var unique_selectors = {};
            for ( var r=0; r<name_rule.source.length; r++ ) {
                var child = name_rule.source[r];
                if ( !unique_selectors[child.selector] ) {
                    unique_selectors[child.selector] = true;
                    duplicates.push(
                        React.createElement("div", {className: "ruleOverview_subName", 
                            key:  "ruleoverview_dup_" + child.uuid, 
                            onClick: 
                                this.viewRuleDetailViaSelector.bind(
                                    this , child.selector
                                ), 
                            title:  child.selector}, 
                             child.selector
                        )
                    );
                }
            }
        }

        return  React.createElement("div", {className: "ruleOverview"}, 
                    React.createElement("div", {className: "ruleOverview_context"}, 
                        React.createElement("div", {className: "ruleOverview_subTitle"}, 
                            "full selector"
                        ), 
                         parents, 
                        React.createElement("div", {className: "ruleOverview_subTitle"}, 
                            "children"
                        ), 
                         children, 
                        React.createElement("div", {className: "ruleOverview_subTitle"}, 
                            "states"
                        ), 
                         states, 
                        React.createElement("div", {className: "ruleOverview_subTitle"}, 
                            "relationships"
                        ), 
                         relationships, 
                        React.createElement("div", {className: "ruleOverview_subTitle"}, 
                            "duplicate names"
                        ), 
                         duplicates, 
                        React.createElement("div", {className: "list_bottom_padding"})
                    )
                );
    }

});


var RulePreview = React.createClass({displayName: "RulePreview",

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["rulestate","bg","outline"],
    		function ( route , prev_route ) {
                //me.forceUpdate();
                me.refreshDisplayedState();
    		},
            "rule_preview"
    	);

        this.refreshDisplayedState();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

    refreshDisplayedState: function () {
        var state,state_name;
        var rule = this.props.rule;

        for ( var s=0; s<rule.states.length; s++ ) {
            state = rule.states[s];
            state_name = state.state_info.states_by_index.join(" ");
            if ( RouteState.route.rulestate ) {
                if ( s == RouteState.route.rulestate-1 ) {
                    $( ".state_" + s ).addClass("selected");
                    $( ".state_" + s ).html( state_name );
                }else{
                    $( ".state_" + s ).removeClass("selected");
                    $( ".state_" + s ).html( s );
                }
            }else{
                $( ".state_" + s ).removeClass("selected");
                $( ".state_" + s ).html( s );
            }
        }

        if ( RouteState.route.bg ) {
            $( ".rulePreview_toggleBGColor" ).addClass("selected");
        }else{
            $( ".rulePreview_toggleBGColor" ).removeClass("selected");
        }

        if ( RouteState.route.outline == "outline" ) {
            $( ".rulePreview_outline" ).addClass("selected");
        }else{
            $( ".rulePreview_outline" ).removeClass("selected");
        }

    },

    toggleBGColor: function () {
        RouteState.toggle({
            bg:"white"
        },{
            bg:""
        });
    },

    outlineElement: function () {
        RouteState.toggle({
            outline:"outline"
        },{
            outline:""
        });
    },

    changeBackgroundColor: function () {
        RouteState.toggle({
            bg:"#fff"
        },{
            bg:""
        });
    },

    changeState: function ( index ) {
        RouteState.toggle({
            rulestate:index
        },{
            rulestate:""
        });
    },

    showHTML: function () {
        var example = this.findRuleExample( this.props.rule );
    },

    componentDidUpdate: function() {
        var rule = this.props.rule;
        var rule_dom = $(".rulePreview_iframe").contents().find( rule.selector );

        if (
            rule_dom.css("display") == "none" ||
            rule_dom.css("visibility") == "hidden"
        ) {
            // changing state would be circular...
            $(".rulePreview_visibility").removeClass("visible");
        }else{
            $(".rulePreview_visibility").addClass("visible");
        }

        this.refreshDisplayedState();
    },

    render: function() {
        var rule = this.props.rule;
        var example = RuleUtil.findRuleExample( rule , this.props.css_info );
        example = example.all;

        this.ele_border = false;

        var states = [],state,state_class;

        if ( rule.states && rule.states.length > 0 ) {

            states.push(
                React.createElement("div", {className: "rulePreview_navLabel", 
                    key:  "rulePreview_navLabel" }, 
                    "states"
                )
            );

            for ( var s=0; s<rule.states.length; s++ ) {
                state = rule.states[s];
                state_class = "rulePreview_state state_" + s;

                states.push(
                    React.createElement("div", {className:  state_class, 
                            title:  state.raw_selector, 
                            key:  "rulePreview_state_" + state.raw_selector, 
                            onClick: 
                                this.changeState.bind( this , s+1+"")
                            }, 
                         s 
                    )
                );
            }

            states.push(
                React.createElement("div", {className: "rulePreview_stateApplied", 
                    key:  "rulePreview_stateApplied" }
                )
            );
        }

        return  React.createElement("div", {className: "rulePreview"}, 
                    React.createElement("div", {className: "rulePreview_stage"}, 
                        React.createElement(MagicFrame, {example:  example, rule:  rule })
                    ), 
                    React.createElement("div", {className: "rulePreview_nav"}, 
                         states, 
                        React.createElement("div", {className: "rulePreview_toggleBGColor", 
                            onClick:  this.toggleBGColor}
                        ), 
                        React.createElement("div", {className: "rulePreview_outline", 
                            onClick:  this.outlineElement}
                        )
                    )
                );
    }

});

var MagicFrame = React.createClass({displayName: "MagicFrame",
    render: function() {
        return React.createElement("iframe", {style: {border: 'none'}, 
                        className: "rulePreview_iframe"});
    },

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["outline","bg","rulestate"],
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_magicFrame"
    	);

        this.renderFrameContents();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_magicFrame" );
    },

    renderFrameContents: function() {
        var doc = this.getDOMNode().contentDocument;
        if( doc.readyState === 'complete' ) {
            var content = this.props.example;
            var ifrm = this.getDOMNode();
            ifrm = (ifrm.contentWindow) ?
                        ifrm.contentWindow :
                            (ifrm.contentDocument.document) ?
                                ifrm.contentDocument.document : ifrm.contentDocument;

            ifrm.document.open();
            ifrm.document.write(content);
            ifrm.document.close();
        } else {
            setTimeout( this.renderFrameContents , 0);
        }

        this.postProcessElement();
    },

    postProcessElement: function () {
        if ( !this.isMounted() ) {
            return;
        }

        var rule = this.props.rule;
        var doc = this.getDOMNode().contentDocument;
        var rule_dom = $(doc).contents().find( rule.selector );

        if ( RouteState.route.outline == "outline" ) {
            rule_dom.css("border", "1px solid #f00" );
        }else{
            rule_dom.css( "border", "" );
        }

        // make sure it is always visible....
        rule_dom.css("display", "block" );

        var frame_bg = "#eee";
        if ( RouteState.route.bg == "white" ) {
            frame_bg = "#fff";
        }

        var body = $(doc).contents().find( "body" );
        body.css("background-color", frame_bg );

        //need to remove previous state without refresh entire page...
        if (
            RouteState.prev_route.rulestate
            && rule.states
            && rule.states.length > 0
        ) {
            var raw_selector =  rule.states[
                                    RouteState.prev_route.rulestate-1
                                ].raw_selector;
            var class_arr = raw_selector.split(" ");

            var cls,cls_arr,cls_build=[];

            for ( var s=0; s<class_arr.length; s++ ) {
                cls = class_arr[s];
                cls_arr = cls.split(".");
                cls_build.push( "." + cls_arr[1] );
                // TODO: apply more if there are more than one state...
                if (
                    cls_arr.length > 2
                ) {
                    $(doc).contents().find( cls_build.join(" ") )
                        .removeClass( cls_arr[2] );
                }else if (
                    cls_arr[0].length > 0
                ) {
                    $(doc).contents().find( cls_arr[0] )
                        .removeClass( cls_arr[1] );
                }
            }
        }

        if ( RouteState.route.rulestate ) {
            var raw_selector =  rule.states[
                                    RouteState.route.rulestate-1
                                ].raw_selector;
            var class_arr = raw_selector.split(" ");

            var cls,cls_arr,cls_build=[];

            for ( var s=0; s<class_arr.length; s++ ) {
                cls = class_arr[s];
                cls_arr = cls.split(".");
                cls_build.push( "." + cls_arr[1] );
                // TODO: apply more if there are more than one state...
                if (
                    cls_arr.length > 2
                ) {
                    $(doc).contents().find( cls_build.join(" ") )
                        .addClass( cls_arr[2] );
                }else if (
                    cls_arr[0].length > 0
                ) {
                    $(doc).contents().find( cls_arr[0] )
                        .addClass( cls_arr[1] );
                }
            }
        }

    },

    componentDidUpdate: function() {
        this.renderFrameContents();
    },
    componentWillUnmount: function() {
        React.unmountComponentAtNode( this.getDOMNode().contentDocument.body );
    }
});



var TypeIcon = React.createClass({displayName: "TypeIcon",

    render: function() {

        var icon_class = "rule_icon";


        if ( this.props.rule.is_duplicate ) {
            icon_class = "dup_icon";
        }else if ( this.props.rule.type == "tagged_rule" ) {
            icon_class = "tagged_icon";
            if ( this.props.rule.metadata.complete ) {
                icon_class = "tagged_icon";
            }else{
                icon_class = "tagged_incomplete_icon";
            }
        }

        /*
        var total_stats = 0;
        if ( this.props.rule.is_extended ) {
            total_stats++;
        }
        if ( this.props.rule.is_duplicate ) {
            total_stats++;
        }
        if ( this.props.rule.extends_rule ) {
            total_stats++;
        }
        */

        var extended = "";
        if ( this.props.rule.is_extended ) {
            extended =
                React.createElement("div", {className: "extendedIcon"}, 
                    React.createElement("div", {className: "extendedIcon_content"})
                );
        }

        //if ( this.props.rule.is_duplicate ) {
        //    extra_text.push( ( total_stats == 1 ) ? "dup" : "dp" );
        //}

        var extendee = "";
        if ( this.props.rule.extends_rule ) {
            extendee =
                React.createElement("div", {className: "extendeeIcon"}, 
                    React.createElement("div", {className: "extendeeIcon_content"})
                );
        }

        //if ( extra_text.length > 0 ) {
        //    extra_text = <div className="extraText">{ extra_text.join(",") }</div>
        //}

        return  React.createElement("div", {className: "typeIcon"}, 
                     extended, 
                     extendee, 
                    React.createElement("div", {className:  icon_class })
                );
    }

});
