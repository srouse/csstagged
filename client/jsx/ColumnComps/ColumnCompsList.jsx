

var ColumnCompsList = React.createClass({

    getInitialState: function(){
        var cssdom = RouteState.route.cssdom;
        if ( typeof RouteState.route.cssdom === 'string' ) {
            cssdom = [RouteState.route.cssdom];
        }

        return {
            cssdom:cssdom
        };
    },

    openRow: function ( uuid ) {
        RouteState.toggle(
            {cssdom:[uuid]},
            {cssdom:["-"+uuid]}
        );
    },

    viewRuleDetail: function ( uuid ) {
        RouteState.toggle(
            {
                tree:uuid,
                rule:uuid,
                detailTab:"example"
            },
            {
                tree:"",
                rule:"",
                detailTab:""
            }
        );
    },

    popUUID: function ( uuid ) {
        RouteState.merge(
            {cssdom:["-"+uuid]}
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"cssdom",
    		function ( route , prev_route ) {
                var cssdom = RouteState.route.cssdom;
                if ( typeof RouteState.route.cssdom === 'string' ) {
                    cssdom = [RouteState.route.cssdom];
                }
                me.setState({
                    cssdom:cssdom
                });
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    componentDidUpdate: function () {
        //nano stuff here

        //$(".nano").nanoScroller();

    },

    _findFocusedDOM : function () {
        var dom = false;
        var dom_children = this.props.css_info.css_dom;

        if (
            this.state.cssdom &&
            this.state.cssdom.length > 0
        ) {
            var dom_uuid = this.state.cssdom[
                                    this.state.cssdom.length-1
                                ];
            var hash_dom = this.props.css_info.uuid_hash[ dom_uuid ];
            if ( hash_dom ) {
                dom = hash_dom;
                dom_children = dom.children;
            }
        }

        return {
            dom:dom,
            dom_array:dom_children
        };
    },

    render: function() {
        var dom_info = this._findFocusedDOM();
        var css_dom = dom_info.dom_array;

        //sort them...
        css_dom.sort(
            function(a, b) {
                // if ( b.children.length == a.children.length ) {
                    var a_name = a.name.toLowerCase();
                    var b_name = b.name.toLowerCase();
                    if (a_name < b_name)
                        return -1;
                    if (a_name > b_name)
                        return 1;
                    return 0;
                // }else{
                //    return b.children.length - a.children.length;
                // }
            }
        );

        list_body_class = "column_ListBody";

        var rows = [];
        var rule;
        var me = this;
        for ( var i=0; i<css_dom.length; i++ ) {
            rule = css_dom[i];
            rows.push(
                <ColumnCompsRow rule={ rule }
                    key={ rule.uuid }
                    onRowClick={ this.openRow }
                    onDetailClick={ this.viewRuleDetail } />
            );
        }

        list_body_class += " nano";

        return  <div className='column_List'>
                    <div className={ list_body_class }>
                        <div className="nano-content">
                            { rows }
                        </div>
                    </div>
                </div>;

    }
});
