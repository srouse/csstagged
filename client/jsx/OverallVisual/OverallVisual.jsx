
var OverallVisual = React.createClass({

    render: function() {

        var totals = this.props.css_info.totals;
        var comps_percent = Math.round( totals.tagged_rules / totals.overall * 100 );
        var rules_percent = Math.round( totals.rules / totals.overall * 100 );

        var show_tag_labels = ( comps_percent > 10 );

        return  <div className='overallVisual'>
                    <div className="cssp_OverallVisual_taggedRules">
                        <div className="overallVisual_taggedBar"
                            style={{width: comps_percent + "%"}}>
                            <span className="tagged_total">
                                { (show_tag_labels) ? totals.tagged_rules : "" }
                            </span>
                            <span className="tagged_percent">
                                { (show_tag_labels) ? comps_percent +"%" : "" }
                            </span>
                            <div className="label">
                                { (show_tag_labels) ? "tagged" : "" }
                            </div>
                        </div>
                        <div className='overallVisual_rulesBar'
                            style={{width: rules_percent + "%"}}>
                            <span className="rules_total">
                                { totals.rules }
                            </span>
                            <span className="rules_percent">
                                { rules_percent }%
                            </span>
                            { /* <div className="label">
                                 untagged
                            </div> */ }
                        </div>
                    </div>

                </div>;
    }
});
