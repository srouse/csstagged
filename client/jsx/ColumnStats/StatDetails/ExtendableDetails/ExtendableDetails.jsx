

var ExtendableDetails = React.createClass({

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

    viewRuleDetail: function ( uuid ) {
        // want the tree not the rule....
        var parent = findTopMostParent( uuid , this.props.css_info );
        RouteState.toggle(
            {
                tree:parent.uuid,
                rule:uuid
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
        var rules = [];
        var me = this;

        var rows = [];
        rules = this.props.css_info.extended_rules;
        rows.push(
            <div className="statDetails_sectionHeader">
                Extended Rules (Parent)
            </div>
        );
        $.each( rules , function ( i , rule_selector ) {
            var rule = me.props.css_info.extended_rules[ i ];
            rows.push(
                <div className="statDetails_row"
                    onClick={
                        me.viewRuleDetail.bind( me , rule.uuid )
                    }>
                    { rule.name }
                    <div className="statDetails_typeIcon">
                        <TypeIcon rule={ rule } />
                    </div>
                </div>
            )
        });

        rules = this.props.css_info.extendee_rules;
        rows.push(
            <div className="statDetails_sectionHeader">
                Rules Extending Other Rules (child)
            </div>
        );
        $.each( rules , function ( i , rule_selector ) {
            var rule = me.props.css_info.extendee_rules[ i ];
            rows.push(
                <div className="statDetails_row"
                    onClick={
                        me.viewRuleDetail.bind( me , rule.uuid )
                    }>
                    { rule.name }
                    <div className="statDetails_typeIcon">
                        <TypeIcon rule={ rule } />
                    </div>
                </div>
            )
        });


        return  <div className="extendableDetails">

                    <div className="statDetails_columnList nano">
                        <div className="nano-content">
                            { rows }
                        </div>
                    </div>

                    <div className="statDetails_columnExplanation">
                        <div className="statDetails_divider"></div>
                        <div className="statDetails_explanation nano">
                            <div className="nano-content">
                                <h1 className="statDetails_h1">
                                    Inheritance
                                </h1>
                                <p className="statDetails_p">
                                    This is a breakdown between rules
                                    that have been extended (darkest) to rules
                                    that extend other rules (medium) to rules
                                    that have no relationships (lightest).
                                </p>
                                <p className="statDetails_p">
                                    Inheritance is determined by rules with
                                    multiple selectors
                                    ( .dog, .cat ... ) with the first
                                    selector being the base or parent. Using
                                    '&:extend()' in less will create these
                                    relationships.
                                </p>
                                <p className="statDetails_p">
                                    Too little (or too much) rule reuse
                                    and your project will be difficult to maintain.
                                    The ratio should be roughly 20/50/30
                                    ( parent / child / unique ).
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="statDetails_close"
                        onClick={ this.close }></div>
                </div>
    }
});
