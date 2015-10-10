

var DepthDetails = React.createClass({

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
                rule:rule.uuid,
                detailTab:"example"
            },{
                tree:"",
                rule:"",
                detailTab:""
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
        var depth_levels = this.props.css_info.depths_all;
        var rows = [];

        var depth_level;
        for ( var d=depth_levels.length-1; d>=4; d-- ) {
            depth_level = depth_levels[d];

            rows.push(
                <div className="statDetails_sectionHeader">
                    Depth { d+1 }
                </div>
            );

            $.each( depth_level , function ( i , rule_uuid ) {
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
        }



        return  <div className="depthDetails">

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
                                    Rule Depths
                                </h1>
                                <p className="statDetails_p">
                                    Nesting/Depth allows for
                                    useful relationships and clustering of
                                    rules. However, selector nesting can also
                                    produce complexity.
                                </p>
                                <p className="statDetails_p">
                                    Depths beyond 4 or 5 imply that a stylesheet
                                    may be too dense or difficult to understand.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="statDetails_close"
                        onClick={ this.close }></div>
                </div>
    }
});
