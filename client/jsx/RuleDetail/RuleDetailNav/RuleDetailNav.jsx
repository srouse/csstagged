
var RuleDetailNav = React.createClass({

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
            return <div>no rule</div>;

        return  <div className="ruleDetailNav">
                    <div className="ruleDetailNav_title">
                        <div className="expandoClose"
                            onClick={ this.closeDetail }></div>
                        <div className="ruleDetailNav_titleText">
                            { rule.name }
                        </div>
                        <div className="ruleDetailNav_typeIcon">
                            <TypeIcon rule={ rule } />
                        </div>
                    </div>
                </div>;
    }

});
