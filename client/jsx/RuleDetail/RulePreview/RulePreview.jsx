
var RulePreview = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"react",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_preview"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

    replaceComps: function ( html_str , rule_names , times_called ) {
        if ( !times_called )
            times_called = 1;

        if ( times_called > 100 ) {
            return {
                html:"<div>Error, too many cycles</div>",
                rule_names:rule_names
            };
        }

        var example_html = $("<div>" +  html_str  + "</div>");
        var sub_rules = example_html.find("div[comp]");
        var sub_rule_html,sub_rule,sub_rule_name;
        var sub_rule_results;

        if ( sub_rules.length > 0 ) {
            var sub_rule_name_arr = [];
            for ( var sr=0; sr<sub_rules.length; sr++ ) {
                sub_rule_html = sub_rules[sr];
                sub_rule_name = $(sub_rule_html).attr("comp");

                // TODO Look for names..if not found, then look for selectors
                if ( this.props.css_info.name_hash[sub_rule_name] ) {
                    sub_rule_name_arr.push( sub_rule_name );
                    sub_rule = this.props.css_info.name_hash[sub_rule_name];
                    if (    sub_rule.metadata
                            && sub_rule.metadata.example )
                    {
                        $(sub_rule_html).replaceWith(
                            $( sub_rule.metadata.example )
                        );
                        found_template = true;
                        break;
                    }else{
                        if ( !found_template ) {
                            $( sub_rule_html ).replaceWith(
                                "<div>error '"
                                + sub_rule_name
                                + "' not found (1)</div>"
                            );
                        }
                    }
                }else{
                    $(sub_rule_html).replaceWith(
                        "<div>error template '"
                        + sub_rule_name
                        + "' not found (2)</div>"
                    );
                }
            }

            return  this.replaceComps(
                        example_html.html(),
                        rule_names.concat( sub_rule_name_arr ),
                        times_called + 1
                    );
        }else{
            return {
                html:html_str,
                rule_names:rule_names
            };
        }
    },

    findRuleExample: function ( rule ) {
        var html = ["<div>no example</div>"];

        if (
            rule.metadata
            && rule.metadata.example
        ) {
            // pull together css
            var css = []

            var img_prefix = this.props.css_info.url_prefix;

            if ( this.props.css_info.fonts ) {
                var fonts = this.props.css_info.fonts;
                var font;
                for ( var f=0; f<fonts.length; f++ ) {
                    font = fonts[f];
                    css.push(
                        "@import url('"+font+"');\n"
                    );
                }
            }

            var global_rules = this.props.css_info.global_rules;
            var global_rule;
            for ( var g=0; g<global_rules.length; g++ ) {
                global_rule = global_rules[g];
                css.push(
                    _ruleAndChildToCSSString(
                        global_rule , true , img_prefix
                    )
                );
            }

            css.push(
                _ruleAndPseudosToCSSString( rule , true , img_prefix )
            );

            // create container classes
            var selector_arr = rule.selector.split(" ");
            var selector_item;
            var html = [];
            for ( var s=0; s<selector_arr.length; s++ ) {
                selector_item = selector_arr[s];
                if ( selector_item != rule.name ) {
                    if ( selector_item.indexOf(".") == 0 ) {
                        html.push(
                            "<div class='" +
                                selector_item.replace("."," ")
                            + "'>"
                        );
                    }
                }
            }

            var sub_comp_info = this.replaceComps(
                rule.metadata.example, []
            );
            html.push( sub_comp_info.html );

            // get the relavent sub component css in there...
            for ( var i=0; i<sub_comp_info.rule_names.length; i++ ) {
                var sub_comp_name = sub_comp_info.rule_names[i];
                var sub_comp_rule = this.props.css_info.name_hash[
                                        sub_comp_name
                                    ];
                css.push(
                    _ruleAndPseudosToCSSString(
                        sub_comp_rule , true , img_prefix
                    )
                );
            };

            for ( var s=0; s<selector_arr.length; s++ ) {
                selector_item = selector_arr[s];
                if ( selector_item != rule.name ) {
                    if ( selector_item.indexOf(".") == 0 ) {
                        html.push("</div>");
                    }
                }
            }

            html.push( "<style>" + css.join("") + "</style>" );
        }

        return html.join("");
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

    showHTML: function () {
        var example = this.findRuleExample( this.props.rule );
        console.log( example );
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
    },

    render: function() {
        var rule = this.props.rule;
        var example = RuleUtil.findRuleExample( rule , this.props.css_info );

        this.ele_border = false;

        return  <div className="rulePreview">
                    <div className="rulePreview_stage">
                        <MagicFrame example={ example } rule={ rule } />
                    </div>
                    <div className="rulePreview_nav">
                        <div className="rulePreview_toggleBGColor"
                            onClick={ this.toggleBGColor }>
                        </div>
                        <div className="rulePreview_outline"
                            onClick={ this.outlineElement }>
                        </div>
                        <div className="rulePreview_html"
                            onClick={ this.showHTML }>
                        </div>
                    </div>
                </div>;
    }

});

var MagicFrame = React.createClass({
    render: function() {
        return <iframe style={{border: 'none'}} className="rulePreview_iframe" />;
    },
    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"outline",
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_preview"
    	);

        RouteState.addDiffListener(
    		"bg",
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_preview"
    	);

        this.renderFrameContents();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

    renderFrameContents: function() {
        var doc = this.getDOMNode().contentDocument;
        if( doc.readyState === 'complete' ) {
            $(doc.body).html( this.props.example );
        } else {
            setTimeout(this.renderFrameContents, 0);
        }

        this.postProcessElement();
    },

    postProcessElement: function () {
        var rule = this.props.rule;
        var doc = this.getDOMNode().contentDocument;
        var rule_dom = $(doc).contents().find( rule.selector );

        if ( RouteState.route.outline == "outline" ) {
            this.prev_border = rule_dom.css("border");
            rule_dom.css("border", "1px solid #f00" );
        }else{
            var border = ( this.prev_border ) ? this.prev_border : "none";
            rule_dom.css("border", border );
        }

        // make sure it is always visible....
        rule_dom.css("display", "block" );

        var frame_bg = "#eee";
        if ( RouteState.route.bg == "white" ) {
            frame_bg = "#fff";
        }

        $(doc).contents().find( "body" ).css("background-color", frame_bg );
    },

    componentDidUpdate: function() {
        this.renderFrameContents();
    },
    componentWillUnmount: function() {
        React.unmountComponentAtNode( this.getDOMNode().contentDocument.body );
    }
});
