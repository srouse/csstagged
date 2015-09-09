


var DepthChart = React.createClass({

    render: function() {

        var depths = this.props.css_info.totals.depths;
        var depths_rules = this.props.css_info.totals.depths_rules;
        var depths_tagged = this.props.css_info.totals.depths_tagged;

        var highest_depth = 0;
        var total_depths = depths.length;
        for ( var i=0; i<depths.length; i++ ) {
            highest_depth = Math.max( depths[i] , highest_depth );
        }

        var rows = [];
        for ( var i=0; i<depths.length; i++ ) {
            rows.push(
                <div className="depthChart_Column"
                    style={{width:100/total_depths + "%"}}
                    key={ i }>
                    <div className="depthChart_Bar">
                        <div className="depthChart_RulesBar"
                            style={{height:
                                ( depths[i]/ highest_depth ) * 100 + '%'
                            }}>
                            <div className="depthChart_label">
                                { depths[i] }
                            </div>
                        </div>
                        <div className="depthChart_CompsBar"
                            style={{height:
                                ( depths_tagged[i]/ highest_depth ) * 100 + '%'
                            }}>
                        </div>
                    </div>
                </div>
            );
        }

        return  <div className='depthChart'>
                    { rows }
                    <div className="depthChart_title">Rule Nesting</div>
                </div>;

    }

});
