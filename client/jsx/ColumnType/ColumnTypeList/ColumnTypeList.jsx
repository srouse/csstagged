
var ColumnTypeList = React.createClass({

    getInitialState: function(){
        return {
            type:RouteState.route.tag
        };
    },

    openRow: function ( tag ) {
        RouteState.toggle(
            {tag:tag,tree:""},
            {tag:"",tree:""}
        );
    },

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid
            },
            {
                tree:"",
                rule:""
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"type",
    		function ( route , prev_route ) {
                me.setState({
                    type:RouteState.route.type
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    buildRuleList : function () {
        var rows = [];
        var rules = this.props.css_info.types_hash[
                        this.state.type
                    ];

        if ( rules ) {
            var rule;
            for ( var i=0; i<rules.length; i++ ) {
                rule = rules[i];
                rows.push(
                    <ColumnCompsRow rule={ rule }
                        key={ rule.uuid }
                        onRowClick={ this.viewRuleDetail }
                        onDetailClick={ this.viewRuleDetail } />
                );
            }
        }

        return rows;
    },

    buildTypeList : function () {

        var rows = [];
        var types = this.props.css_info.types_hash;

        var types_arr = [];
        for ( var type in types ) {
            types_arr.push( {
                type:type,
                length:types[type].length
            } );
        }

        types_arr.sort(
            function(a, b) {
                if (a.type > b.type) {
                    return 1;
                }
                if (a.type < b.type) {
                    return -1;
                }
                return 0;
            }
        );

        var type_arr;
        var type;
        for ( var t=0; t<types_arr.length; t++ ) {
            type = types_arr[t].type;
            type_arr = types[type];
            rows.push(
                <div className="column_List_Row"
                    key={ type }>
                    <div className="column_rowTitle"
                        onClick={ this.openRow.bind( this , type ) }>
                        { type }
                        <div className="column_rowTotal">
                            {
                                ( type_arr.length > 0 ) ?
                                    type_arr.length : ""
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return rows;
    },

    render: function() {

        var rows;
        rows = this.buildTypeList();

        return  <div className="column_List">
                    <div className="column_ListBody nano">
                        <div className="nano-content">
                            { rows }
                        </div>
                    </div>
                </div>;

    }
});