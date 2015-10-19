



var StyleGuideNav = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["tab"],
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "StyleGuideNav"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "StyleGuideNav" );
    },

    gotoVariables: function () {
        RS.merge(
            {tab:""}
        );
    },

    gotoRules: function () {
        RS.merge(
            {tab:"rules"}
        );
    },

    gotoVariableCluster: function ( index ) {
        RS.merge(
            {variables:index}
        );
    },

    getVariablesList: function () {
        var variable_titles = CSSInfo.definitions.title;

        var var_title;
        var var_html = [];
        for ( var v=0; v<variable_titles.length; v++ ) {
            var_title = variable_titles[v];
            var_html.push(
                <div className="styleGuideNav_listRow"
                    key={ "variables_" + v }
                    onClick={ this.gotoVariableCluster.bind( this , v ) }>
                    <div className="styleGuideNav_rowLabel">
                        { var_title.content }
                    </div>
                </div>
            );
        }
        return <div className="styleGuideList">{ var_html }</div>;
    },


    render: function() {

        var var_class = " selected";
        var rules_class = "";
        var var_list = [];
        if ( RS.route.tab == "rules" ) {
            rules_class = " selected";
            var_class = "";
            var_list = <StyleGuideRulesNav />;
        }else{
            var_list = this.getVariablesList();
        }

        return  <div className="styleGuideNav">
                    <div className="styleGuideNav_mainNav">
                        <div className={ "styleGuideNav_mainItem" + var_class }
                            onClick={ this.gotoVariables }>
                            Variables
                        </div>
                        <div className={ "styleGuideNav_mainItem" + rules_class }
                            onClick={ this.gotoRules }>
                            Rules
                        </div>
                    </div>
                    <div className="styleGuideNav_listContainer">
                        { var_list }
                    </div>
                </div>;
    }
});
