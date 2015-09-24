
var RuleCSS = React.createClass({

    processSelectorIntoHTML: function ( selector ) {
        var rule_arr = selector.split(" ");
        var new_rule_arr = [];
        for ( var i=0; i<rule_arr.length; i++ ) {
            new_rule_arr.push( rule_arr[i] );
            new_rule_arr.push( <br /> );
        }
        return new_rule_arr;
    },

    gotoRule: function ( rule_uuid ) {
        RouteState.merge({tree:rule_uuid});
    },

    componentDidUpdate: function () {
        $("code").removeClass("rainbow");// it won't refresh otherwise
        Rainbow.color();
    },

    componentDidMount: function () {
        Rainbow.color();
    },

    render: function() {
        var rule =  this.props.css_info.uuid_hash[
                        this.props.rule_uuid
                    ];

        var rule = this.props.rule;

        if ( !rule ) {
            return <div></div>;
        }

        var state_code = [];
        var state_header = "";
        state_header = <div className="ruleDetail_title">States</div>;
        if ( rule.states ) {
            $.each( rule.states , function ( index , state ) {
                state_code.push(
                    <pre className="ruleDetail_pre"
                        key={ "state_" + index }>
                        <code data-language="css"
                            dangerouslySetInnerHTML={{
                                __html:ruleToCSSString( state , true )
                            }}>
                        </code>
                    </pre>
                )
            });
        }

        var pseudo_code = [];
        var pseudo_header = "";
        if ( rule.pseudos ) {
            pseudo_header = <div className="ruleDetail_title">Pseudo Selectors</div>;
            $.each( rule.pseudos , function ( index , pseudo ) {
                pseudo_code.push(
                    <pre className="ruleDetail_pre"
                        key={ "pseudo_" + index }>
                        <code data-language="css"
                            dangerouslySetInnerHTML={{
                                __html:ruleToCSSString( pseudo , true )
                            }}>
                        </code>
                    </pre>
                )
            });
        }

        return  <div className="ruleCSS">
                    <div className="ruleDetail_code">
                        <pre className="ruleDetail_pre">
                            <code data-language="css"
                                dangerouslySetInnerHTML={{
                                    __html:ruleToCSSString( rule , true )
                                }}>
                            </code>
                        </pre>
                        { pseudo_header }
                        { pseudo_code }
                        { state_header }
                        { state_code }
                    </div>
                </div>;
    }

});
