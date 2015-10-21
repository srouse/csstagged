

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

    gotoTags: function () {
        RS.merge(
            {tag:""}
        );
    },

    gotoTag: function ( tag ) {
        RS.merge(
            {tag:tag}
        );
    },

    gotoRule: function ( rule ) {
        RS.merge(
            {tree:rule.uuid}
        );
    },

    render: function() {

        if ( RS.route.tag ) {
            var tag = RS.route.tag;

            var rules = CSSInfo.design_tags_hash[ RS.route.tag ];
            if ( RS.route.tab == "base_ui" ) {
                rules = CSSInfo.base_tags_hash[ RS.route.tag ];
            }

            var html = [];

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

                var rule_uuid,rule;
                for ( var t=0; t < rules.length; t++ ) {
                    rule_uuid = rules[t];
                    rule = CSSInfo.uuid_hash[ rule_uuid ];
                    html.push(
                        <div className="styleGuideNav_listRow"
                            key={ "rule_" + rule.uuid }
                            onClick={ this.gotoRule.bind( this , rule ) }>
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

            var tags = CSSInfo.design_tags;
            if ( RS.route.tab == "base_ui" ) {
                tags = CSSInfo.base_tags;
            }

            var html = [],tag,tag_rules;
            for ( var t=0; t < tags.length; t++ ) {
                tag = tags[t];

                if ( RS.route.tab == "base_ui" ) {
                    tag_rules = CSSInfo.base_tags_hash[ tag ];
                }else{
                    tag_rules = CSSInfo.design_tags_hash[ tag ];
                }
                
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
