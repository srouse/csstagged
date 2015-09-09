

var DuplicateDetails = React.createClass({

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
                rule:rule.uuid
            },{
                tree:"",
                rule:""
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
            <div className="statDetails_sectionHeader">
                Duplicate Names
            </div>
        );
        $.each( rules , function ( i , rule_name ) {
            var rule = me.props.css_info.name_hash[ rule_name ];
            if ( rule ) {
                rows.push(
                    <div className="statDetails_row"
                        onClick={
                            me.viewRuleDetail.bind( me , rule.selector )
                        }>
                        { rule.name }
                        <div className="statDetails_typeIcon">
                            <TypeIcon rule={ rule } />
                        </div>
                    </div>
                );
            }
        });

        return  <div className="duplicateDetails">

                    <div className="statDetails_columnList nano">
                        <div className="nano-content">
                            { rows }
                        </div>
                    </div>

                    <div className="statDetails_columnExplanation">
                        <div className="statDetails_divider"></div>
                        <div className="statDetails_explanation">
                            <div className="nano-content">
                                <h1 className="statDetails_h1">
                                    Duplicate Rules
                                </h1>
                                <p className="statDetails_p">
                                    Duplicate rules are rules that use the
                                    same name (last part of a selector), but
                                    in a different area. Duplicates open the
                                    possibility of rules colliding. Solutions
                                    include using unique names with prefixes or
                                    utlizing states (.dog.mutt).
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="statDetails_close"
                        onClick={ this.close }></div>
                </div>
    }
});
