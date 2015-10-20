





var VariablesPage = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListeners(
    		["variables"],
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "VariablesPage"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "VariablesPage" );
    },


    render: function() {

        var variable_titles = CSSInfo.definitions.title;
        var descriptions = CSSInfo.definitions.description;
        var definitions = CSSInfo.definitions.definitions;
        var def_html = [];

        var variables = [];
        var variable_title,description;
        var definitions_index = 0;
        if ( variable_titles.length > RS.route.variables ) {
            variable_title = variable_titles[RS.route.variables];
            description = descriptions[RS.route.variables];
            definitions_index = variable_title.definitions_index;
            def_html.push(
                <div className="variablePage_title"
                    key={ "variablePage_title" }>
                    { variable_title.content }
                </div>
            );
            def_html.push(
                <div className="variablePage_description"
                    key={ "variablePage_description" }>
                    { description.content }
                </div>
            );
        }

        var definitions_end_index = definitions.length;
        if ( variable_titles.length > parseInt( RS.route.variables )+1 ) {
            variable_title = variable_titles[parseInt( RS.route.variables )+1];
            definitions_end_index = variable_title.definitions_index;
        }
        console.log( definitions_index , variable_titles.length );
        var definition;

        for ( var i=definitions_index; i<definitions_end_index; i++ ) {
            definition = definitions[i];
            def_html.push(
                <div className="variablePage_variableLabel"
                    key={ "var_" + i }>
                    <span className="variablePage_variableName">
                        { definition.name }</span>: { definition.value };
                </div>
            );
        }

        return  <div className="variablePage">
                    { def_html }
                </div>;
    }
});
