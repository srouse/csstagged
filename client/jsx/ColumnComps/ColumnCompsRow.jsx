

var ColumnCompsRow = React.createClass({

    openRow: function ( uuid ) {
        /*RouteState.toggle(
            {cssdom:[uuid]},
            {cssdom:["-"+uuid]}
        );*/
        // this.props.onRowClick( uuid );
        this.props.onDetailClick( uuid );
    },

    viewRuleDetail: function ( uuid ) {
        /*RouteState.toggle(
            {tree:uuid},
            {tree:""}
        );*/
        this.props.onDetailClick( uuid );
    },

    render: function() {
        var rule = this.props.rule;

        return <div className="column_List_Row"
                onClick={
                    this.openRow.bind( this , rule.uuid )
                }>
                <div className="column_rowTitle">
                    { rule.name }
                    <div className="column_typeBox">
                        <TypeIcon rule={ rule } />
                    </div>
                </div>

            </div>;
    }
});
