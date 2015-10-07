
var RulePreview = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"react",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_preview"
    	);

        RouteState.addDiffListener(
    		"rulestate",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "rule_preview"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_preview" );
    },

    toggleBGColor: function () {
        RouteState.toggle({
            bg:"white"
        },{
            bg:""
        });
    },

    outlineElement: function () {
        RouteState.toggle({
            outline:"outline"
        },{
            outline:""
        });
    },

    changeBackgroundColor: function () {
        RouteState.toggle({
            bg:"#fff"
        },{
            bg:""
        });
    },

    changeState: function ( index ) {
        RouteState.toggle({
            rulestate:index
        },{
            rulestate:""
        });
    },

    showHTML: function () {
        var example = this.findRuleExample( this.props.rule );
    },

    componentDidUpdate: function() {
        var rule = this.props.rule;
        var rule_dom = $(".rulePreview_iframe").contents().find( rule.selector );

        if (
            rule_dom.css("display") == "none" ||
            rule_dom.css("visibility") == "hidden"
        ) {
            // changing state would be circular...
            $(".rulePreview_visibility").removeClass("visible");
        }else{
            $(".rulePreview_visibility").addClass("visible");
        }
    },

    render: function() {
        var rule = this.props.rule;
        var example = RuleUtil.findRuleExample( rule , this.props.css_info );

        this.ele_border = false;

        var states = [],state,state_class;
        for ( var s=0; s<rule.states.length; s++ ) {
            state = rule.states[s];
            state_class = "rulePreview_state";
            if ( RouteState.route.rulestate ) {
                if ( s == RouteState.route.rulestate-1 ) {
                    state_class += " selected";
                }
            }

            states.push(
                <div className={ state_class }
                        title={ state.raw_selector }
                        key={ state.raw_selector }
                        onClick={
                            this.changeState.bind( this , s+1+"" )
                        }>
                    { s }
                </div>
            );
        }

        return  <div className="rulePreview">
                    <div className="rulePreview_stage">
                        <MagicFrame example={ example } rule={ rule } />
                    </div>
                    <div className="rulePreview_nav">
                        <div className="rulePreview_navLabel">
                            states
                        </div>
                        { states }

                        <div className="rulePreview_toggleBGColor"
                            onClick={ this.toggleBGColor }>
                        </div>
                        <div className="rulePreview_outline"
                            onClick={ this.outlineElement }>
                        </div>
                        <div className="rulePreview_html"
                            onClick={ this.showHTML }>
                        </div>
                    </div>
                </div>;
    }

});

var MagicFrame = React.createClass({
    render: function() {
        return <iframe style={{border: 'none'}} className="rulePreview_iframe" />;
    },
    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"outline",
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_magicFrame"
    	);

        RouteState.addDiffListener(
    		"bg",
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_magicFrame"
    	);

        RouteState.addDiffListener(
    		"rulestate",
    		function ( route , prev_route ) {
                me.postProcessElement();
    		},
            "rule_magicFrame"
    	);

        this.renderFrameContents();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "rule_magicFrame" );
    },

    renderFrameContents: function() {
        var doc = this.getDOMNode().contentDocument;
        if( doc.readyState === 'complete' ) {
            $(doc.body).html( this.props.example );
        } else {
            setTimeout( this.renderFrameContents , 0);
        }

        this.postProcessElement();
    },

    postProcessElement: function () {
        var rule = this.props.rule;
        var doc = this.getDOMNode().contentDocument;
        var rule_dom = $(doc).contents().find( rule.selector );

        if ( RouteState.route.outline == "outline" ) {
            this.prev_border = rule_dom.css("border");
            rule_dom.css("border", "1px solid #f00" );
        }else{
            var border = ( this.prev_border ) ? this.prev_border : "none";
            rule_dom.css("border", border );
        }

        // make sure it is always visible....
        rule_dom.css("display", "block" );

        var frame_bg = "#eee";
        if ( RouteState.route.bg == "white" ) {
            frame_bg = "#fff";
        }

        var body = $(doc).contents().find( "body" );
        body.css("background-color", frame_bg );

        // body sticks around during refresh...
        body.removeClass();
        if ( RouteState.route.rulestate ) {
            var raw_selector =  rule.states[
                                    RouteState.route.rulestate-1
                                ].raw_selector;
            var class_arr = raw_selector.split(" ");

            var cls,cls_arr,cls_build=[];


            for ( var s=0; s<class_arr.length; s++ ) {
                cls = class_arr[s];
                cls_arr = cls.split(".");
                cls_build.push( "." + cls_arr[1] );
                // TODO: apply more if there are more than one state...
                if (
                    cls_arr.length > 2
                ) {
                    $(doc).contents().find( cls_build.join(" ") )
                        .addClass( cls_arr[2] );
                }else if (
                    cls_arr[0].length > 0
                ) {
                    $(doc).contents().find( cls_arr[0] )
                        .addClass( cls_arr[1] );
                }
            }
        }

    },

    componentDidUpdate: function() {
        this.renderFrameContents();
    },
    componentWillUnmount: function() {
        React.unmountComponentAtNode( this.getDOMNode().contentDocument.body );
    }
});
