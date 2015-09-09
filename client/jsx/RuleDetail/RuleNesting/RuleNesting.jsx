

var RuleNesting = React.createClass({

    /* no such reference exists in data...
    topMostRule: function ( rule ) {
        if ( rule.parent ) {
            return topMostRule( rule.parent );
        }else{
            return rule;
        }
    },
    */

    render: function() {
        var rule = this.props.rule;//css_info.uuid_hash[RouteState.route.tree];
        if ( !rule )
            return <div>no rule found</div>;

        var content =
            <RuleNestingColumn {...this.props}
                rule={ rule } index={ 0 } />;

            if ( rule.children && rule.children.length == 0 ) {
            content =
                <div className="ruleNesting_noChildren">
                    no children
                </div>;
        }

        return  <div className="ruleNesting">
                    { content }
                </div>;
    }

});
