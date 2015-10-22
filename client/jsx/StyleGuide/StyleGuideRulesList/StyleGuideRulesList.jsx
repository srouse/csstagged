

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

    backOutOfRule: function () {
        RS.merge(
            {detailTab:"",tree:""}
        );
    },

    gotoRule: function ( rule ) {
        var detailTab = RS.route.detailTab;
        if ( !detailTab )
            detailTab = "example";

        RS.merge(
            {tree:rule.uuid,rule:"",detailTab:detailTab}
        );
    },

    render: function() {

        var html = [];

        if ( RS.route.tree ) {
            var rule = CSSInfo.uuid_hash[ RS.route.tree ];

            html.push(
                <div className="styleGuideNav_rulesListHeader"
                    key={ "tag_title_" + tag }
                    onClick={ this.backOutOfRule }>
                    <div className="styleGuideNav_rowLabel">
                        { rule.name }
                    </div>
                </div>
            );
            html .push(
                <div className="styleGuideNav_rulesList_listWithHeader">
                    <RuleNesting rule={ rule } />
                </div>
            );
        }else if ( RS.route.tag ) {
            var tag = RS.route.tag;

            var rules = CSSInfo.design_tags_hash[ RS.route.tag ];
            if ( RS.route.tab == "base_ui" ) {
                rules = CSSInfo.base_tags_hash[ RS.route.tag ];
            }

            html.push(
                <div className="styleGuideNav_rulesListHeader"
                    key={ "tag_title_" + tag }
                    onClick={ this.gotoTags }>
                    <div className="styleGuideNav_rowLabel">
                        { tag }
                    </div>
                </div>
            );

            var sub_html = [];
            if ( rules ) {
                var rule_uuid,rule;
                for ( var t=0; t < rules.length; t++ ) {
                    rule_uuid = rules[t];
                    rule = CSSInfo.uuid_hash[ rule_uuid ];
                    sub_html.push(
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
            html.push(
                <div className="styleGuideNav_rulesList_listWithHeader">
                    { sub_html }
                </div>
            );

        }else{

            var tags = CSSInfo.design_tags;
            if ( RS.route.tab == "base_ui" ) {
                tags = CSSInfo.base_tags;
            }

            var tag,tag_rules;

            var sub_html = [];
            for ( var t=0; t < tags.length; t++ ) {
                tag = tags[t];

                if ( RS.route.tab == "base_ui" ) {
                    if ( tag == "base" )
                        continue;
                    tag_rules = CSSInfo.base_tags_hash[ tag ];
                }else{
                    tag_rules = CSSInfo.design_tags_hash[ tag ];
                }

                sub_html.push(
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
            html.push(
                <div className="styleGuideNav_rulesList_list">
                    { sub_html }
                </div>
            );

        }

        return  <div className="styleGuideNav_rulesList">
                    { html }
                </div>;
    }
});
