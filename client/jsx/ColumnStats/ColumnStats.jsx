
var ColumnStats = React.createClass({

    componentDidUpdate: function () {
        this.renderCircles();
    },

    componentDidMount: function () {
        this.renderCircles();
    },

    renderCircles : function () {
        CTagCircles.renderAllCircles( $(".tile_circle") );
    },

    showDetails: function ( type ) {
        RouteState.toggle(
            {statDetails:type},
            {statDetails:""}
        )
    },

    render: function() {
        var totals = this.props.css_info.totals;
        var scores = this.props.css_info.scores;

        return  <div className='columnStats'>
                    <div className="columnStats_graph">
                        { /*<div className="overall_score">
                            {
                                Math.round(
                                    scores.overall * 100
                                )
                            }%
                            <div className="overall_score_label">
                                Overall
                            </div>
                        </div>
                        <div className="time_to_process">
                            { totals.time_to_process }ms
                        </div>*/ }
                        <div className="column_logo">
                            <a  href="http://www.csstagged.com"
                                target="_csstagged">
                                <img className="column_logo_img"
                                    src={
                                        this.props.css_info.install_base +
                                        'client/_client/_assets/logo_h_small@2x.png'
                                    } />
                            </a>
                        </div>
                    </div>
                    <div className="columnStats_content">
                        <div className="columnStats_tile tagged_rules"
                            onClick={
                                this.showDetails.bind(
                                    this , "tagged"
                                )
                            }>
                            <div className="tile_graph">
                                <div className="tile_circle"
                                    data-score={
                                        Math.round(
                                            totals.tagged_rules /
                                            totals.overall * 100
                                        )
                                    }
                                    data-base-color="#FFE29B"
                                    data-score-color="#79E1DA">
                                </div>
                            </div>
                            <div className="tile_label">
                                Tagged Rules
                                <div className="columnStats_typeBox">
                                    <TypeIcon rule={{
                                            type:"tagged_rule",
                                            metadata:{complete:false}
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="columnStats_tile complete_tags"
                            onClick={
                                this.showDetails.bind(
                                    this , "complete"
                                )
                            }>
                            <div className="tile_graph">
                                <div className="tile_circle"
                                    data-score={
                                        Math.round(
                                            totals.tagged_completed /
                                            totals.overall * 100
                                        )
                                    }
                                    data-score-two={
                                        Math.round(
                                            ((
                                                totals.tagged_rules
                                            ) / totals.overall ) * 100
                                        )
                                    }
                                    data-base-color="#FFE29B"
                                    data-score-color="#79E1DA"
                                    data-score-two-color="#555">
                                </div>
                            </div>
                            <div className="tile_label">
                                Complete Tags
                                <div className="columnStats_typeBox">
                                    <TypeIcon rule={{
                                            type:"tagged_rule",
                                            metadata:{complete:true}
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="extendable_tile"
                            onClick={
                                this.showDetails.bind(
                                    this , "extendable"
                                )
                            }>
                            <div className="tile_graph">
                                <div className="tile_circle"
                                    data-score={
                                        Math.round(
                                            (totals.rules_extended /
                                             totals.overall ) * 100
                                        )
                                    }
                                    data-score-two={
                                        Math.round(
                                            (( totals.rules_extendee +
                                            totals.rules_extended ) /
                                            totals.overall) * 100
                                        )
                                    }
                                    data-label={
                                        Math.round(
                                            (
                                                totals.rules_extended /
                                                totals.overall
                                            ) * 100
                                        ) + "%"
                                    }
                                    data-base-color="#eee"
                                    data-score-color="#555"
                                    data-score-two-color="#d8d8d8">
                                </div>
                            </div>
                            <div className="tile_label">
                                Extended Rules
                                <div className="columnStats_typeBox">
                                    <TypeIcon rule={{
                                            type:"tagged_rule",
                                            is_extended:true,
                                            metadata:{complete:true}
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="columnStats_tile duplicates"
                            onClick={
                                this.showDetails.bind(
                                    this , "duplicates"
                                )
                            }>
                            <div className="tile_graph">
                                <div className="tile_circle"
                                    data-score={
                                        Math.round(
                                            totals.name_duplicates
                                            / totals.overall * 100
                                        )
                                    }
                                    data-label={ totals.name_duplicates }
                                    data-base-color="#555"
                                    data-score-color="#FF8990">
                                </div>
                            </div>
                            <div className="tile_label">
                                Duplicate Names
                                <div className="columnStats_typeBox">
                                    <TypeIcon rule={{
                                            type:"tagged_rule",
                                            is_duplicate:true
                                        }} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="columnStats_depthChart"
                        onClick={ this.showDetails.bind( this , "depth" ) }>
                        <DepthChart {...this.props}></DepthChart>
                    </div>

                </div>;

    }
});
