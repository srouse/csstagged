

var StatDetails = React.createClass({

    getInitialState: function(){
        return {
            statDetails:RouteState.route.statDetails
        };
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
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    render: function() {
        var rules = [];
        var me = this;

        var comp = <div></div>;
        if ( this.state.statDetails == "duplicates" ) {
            comp = <DuplicateDetails {...this.props} />
        }else if ( this.state.statDetails == "extendable" ) {
            comp = <ExtendableDetails {...this.props} />;
        }else if ( this.state.statDetails == "depth" ) {
            comp = <DepthDetails {...this.props} />;
        }else if ( this.state.statDetails == "tagged" ) {
            comp = <TaggedDetails {...this.props} />;
        }else if ( this.state.statDetails == "complete" ) {
            comp = <CompleteDetails {...this.props} />;
        }

        return  comp;
    }
});
