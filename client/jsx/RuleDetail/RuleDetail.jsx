

var RuleDetail = React.createClass({

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
            var rules_by_tag = this.props.css_info.tags_hash[this.state.tag];
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
            content = <RuleCSS
                        css_info={ this.props.css_info }
                        rule_uuid={ this.state.rule_uuid }
                        rule={ rule } />;
        }else if ( RouteState.route.detailTab == "overview" ) {
            content = <RuleOverview
                        css_info={ this.props.css_info }
                        rule={ rule } />;
        }else if ( RouteState.route.detailTab == "example" ) {
            content = <RulePreview
                        css_info={ this.props.css_info }
                        rule_uuid={ this.state.rule_uuid }
                        rule={ rule } />;
        }

        return  <div className="ruleDetail">

                    <div className="ruleDetail_header">
                        <div className="ruleDetail_title">
                            <div className="ruleDetail_close"
                                onClick={ this.close }></div>
                            { /* <div className="ruleDetail_titleText"
                                onClick={ this.toRoot }>
                                { tree_rule.name }
                            </div>
                            <div className="ruleDetail_iconBox">
                                <TypeIcon rule={ tree_rule } />
                            </div> */ }
                            <div className="ruleDetail_showTree"
                                onClick={ this.closeDetail }></div>
                        </div>

                        <div className="ruleDetail_headerNav">
                            <div className="ruleDetail_item_example"
                                onClick={
                                    this.change_tab.bind( this , "example")
                                }>
                                example
                            </div>
                            <div className="ruleDetail_item_css"
                                onClick={
                                    this.change_tab.bind( this , "code")
                                }>
                                code
                            </div>
                            <div className="ruleDetail_item_overview"
                                onClick={
                                    this.change_tab.bind( this , "overview" )
                                }>
                                overview
                            </div>

                            { /*<div className="ruleDetail_back"
                                onClick={ this.close }></div> */ }

                        </div>
                    </div>

                    <div className="ruleDetail_contentContainer">
                        { content }
                    </div>


                    <RuleNesting
                        css_info={ this.props.css_info }
                        rule={ tree_rule } />

                    <RuleDetailNav
                        css_info={ this.props.css_info }
                        rule_uuid={ this.state.rule_uuid }
                        rule={ rule } />

                </div>;
    }

});
