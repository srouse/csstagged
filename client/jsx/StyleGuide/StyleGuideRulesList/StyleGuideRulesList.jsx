

var StyleGuideRulesNav = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["tag"],
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "StyleGuideRulesNav"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "StyleGuideRulesNav" );
    },

    gotoTag: function ( tag ) {
        RS.merge(
            {tag:tag}
        );
    },

    gotoTags: function () {
        RS.merge(
            {tag:""}
        );
    },

    render: function() {

        if ( RS.route.tag ) {
            var tag = RS.route.tag;
            var rules = CSSInfo.tags_hash[ RS.route.tag ];
            var html = [],rule;

            html.push(
                <div className="styleGuideNav_rulesListHeader"
                    key={ "tag_title_" + tag }
                    onClick={ this.gotoTags }>
                    <div className="styleGuideNav_rowLabel">
                        { tag }
                    </div>
                </div>
            );

            if ( rules ) {

                for ( var t=0; t < rules.length; t++ ) {
                    rule = rules[t];
                    html.push(
                        <div className="styleGuideNav_listRow"
                            key={ "rule_" + rule.uuid }
                            onClick={ this.gotoTag.bind( this , rule ) }>
                            <div className="styleGuideNav_rowLabelRight">

                            </div>
                            <div className="styleGuideNav_rowLabel">
                                { rule.name }
                            </div>
                        </div>
                    );
                }
            }

        }else{

            var tags = CSSInfo.tags;
            var html = [],tag,tag_rules;
            for ( var t=0; t < tags.length; t++ ) {
                tag = tags[t];
                tag_rules = CSSInfo.tags_hash[ tag ];
                html.push(
                    <div className="styleGuideNav_listRow"
                        key={ "tag_" + tag }
                        onClick={ this.gotoTag.bind( this , tag ) }>
                        <div className="styleGuideNav_rowLabelRight">
                            { tag_rules.length }
                        </div>
                        <div className="styleGuideNav_rowLabel">
                            { tag }
                        </div>
                    </div>
                );
            }

        }

        return  <div className="styleGuideNav_rulesList">
                    { html }
                </div>;
    }
});
