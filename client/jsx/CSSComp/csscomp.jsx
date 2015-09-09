/** @jsx React.DOM */

// Create a custom component by calling React.createClass.

var CSSComp = React.createClass({

    render: function() {
        return  <div className="cssComp">

                    <div className="cssComp_columns">
                        <ColumnStats
                            css_info={ this.props.css_info } />
                        <ColumnComps
                            css_info={ this.props.css_info } />
                        <ColumnType
                            css_info={ this.props.css_info } />
                    </div>
                    <RuleDetail {...this.props} />
                    <StatDetails {...this.props} />
                    <OverallVisual css_info={ this.props.css_info } />
                </div>;
    }
});
