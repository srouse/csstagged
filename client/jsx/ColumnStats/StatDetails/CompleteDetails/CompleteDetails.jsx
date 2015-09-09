

var CompleteDetails = React.createClass({

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
        var rules = this.props.css_info.incomplete_tagged_rules;
        var rows = [];

        rows.push(
            <div className="statDetails_sectionHeader">
                Incomplete Tagged Rules
            </div>
        );

        $.each( rules , function ( i , rule_uuid ) {
            console.log( rule_uuid );
            var rule = me.props.css_info.uuid_hash[ rule_uuid ];
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
                                    Complete Tagged Rules
                                </h1>
                                <p className="statDetails_p">
                                    Complete tags will have a tag attribute
                                    as well as an example HTML snippet.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="statDetails_close"
                        onClick={ this.close }></div>
                </div>
    }
});
