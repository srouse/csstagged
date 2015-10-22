

var StyleGuide = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["tree","tab","detailTab","rule"],
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "StyleGuide"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "StyleGuide" );
    },

    render: function() {

        var content = <VariablesPage />;
        if ( RS.route.tree || RS.route.rule ) {
            var rule = CSSInfo.uuid_hash[ RS.route.tree ];
            if ( RS.route.rule ) {
                rule = CSSInfo.uuid_hash[ RS.route.rule ];
            }

            var page = <RulePreview
                            css_info={ CSSInfo }
                            rule={ rule } />;
            if ( RS.route.detailTab == "code" ) {
                page = <RuleCSS
                            css_info={ CSSInfo }
                            rule={ rule } />;
            }

            content =
                <div className="styleGuide_ruleOverview">
                    <div className="styleGuide_ruleNavPlaceholder">
                        <RuleDetailNav css_info={ CSSInfo }
                                rule={ rule } />
                    </div>
                    <div className="styleGuide_previewPlaceholder">
                        { page }
                    </div>
                </div>;
        }

        return  <div className="styleGuide">
                    <div className="styleGuide_nav">
                        <StyleGuideNav />
                    </div>
                    <div className="styleGuide_content">
                        { content }
                    </div>
                </div>;
    }
});
