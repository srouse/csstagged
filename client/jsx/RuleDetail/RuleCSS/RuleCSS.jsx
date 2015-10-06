
var RuleCSS = React.createClass({


    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"react",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_preview"
    	);

        $(".ruleDetail_textarea").each( function () {
            $(this).height( $(this)[0].scrollHeight );
        });
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

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

    toReact: function () {
        RouteState.toggle({react:"react"},{react:""});
    },

    componentDidUpdate: function () {
        $(".ruleDetail_textarea").each( function () {
            $(this).height( 10 );
            $(this).height( $(this)[0].scrollHeight );
        });
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
                    <textarea className="ruleDetail_textarea"
                        readOnly spellcheck="false"
                        key={ "state_" + index }
                        value={ ruleToCSSString( state , true ) }>
                    </textarea>
                )
            });
        }

        var pseudo_code = [];
        var pseudo_header = "";
        if ( rule.pseudos ) {
            pseudo_header = <div className="ruleDetail_title">Pseudo Selectors</div>;
            $.each( rule.pseudos , function ( index , pseudo ) {
                pseudo_code.push(
                    <textarea className="ruleDetail_textarea"
                        readOnly spellcheck="false"
                        key={ "pseudo_" + index }
                        value={ ruleToCSSString( pseudo , true ) }>
                    </textarea>
                )
            });
        }

        var html = RuleUtil.findRuleExample( rule , this.props.css_info , true );
        if ( RouteState.route.react == "react" ) {
            html = html.replace( /class=/gi , "className=");
        }

        return  <div className="ruleCSS">
                    <div className="ruleDetail_code">
                        <div className="ruleDetail_title">
                            HTML Example
                            <div className="ruleDetail_titleButton"
                                onClick={ this.toReact }>React</div>
                        </div>
                        <textarea className="ruleDetail_textarea"
                            spellcheck="false"
                            readOnly value={ vkbeautify.xml( html ) }>
                        </textarea>
                        <div className="ruleDetail_title">CSS</div>
                        <textarea className="ruleDetail_textarea"
                            spellcheck="false"
                            readOnly value={ ruleToCSSString( rule , true ) }>
                        </textarea>
                        { pseudo_header }
                        { pseudo_code }
                        { state_header }
                        { state_code }
                    </div>
                </div>;
    }

});
