
var install_base;
if ( !install_base )
    install_base = "../";

var css_install = [
    "node_modules/nanoscroller/bin/css/nanoscroller.css",
    "client/_client/csscomp.css"
];

var js_install = [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/routestate/RouteState.js",
    "node_modules/raphael/raphael-min.js",
    "node_modules/react/dist/react.js",
    "node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js",

    "client/libs/Hashes.js",
    "client/libs/CTagCircles.js",
    "client/libs/RuleUtil.js",
    "client/libs/vkbeautify.0.99.00.beta.js",

    "client/csstagging_rules.js",
    "client/csstagging_tagged.js",
    "client/csstagging_states.js",
    "client/csstagging_scores.js",
    "client/csstagging_serializers.js",
    "client/csstagging_utils.js",
    "client/csstagging.js",
    "client/_client/csscomp.js",
];

var css_link,html = [];
for ( var c=0; c<css_install.length; c++ ) {
    css_link = css_install[c];
    html.push(
        "<link rel='stylesheet' type='text/css' href='"
            + install_base + css_link
        +"'></link>"
    );
}

var js_link;
for ( var j=0; j<js_install.length; j++ ) {
    js_link = js_install[j];
    html.push(
        "<script src='"
        + install_base + js_link
        +"'></script>"
    );
}

document.write( html.join("\n") );

var RS,CSSInfo;
window.onload = function () {
    RouteState.listenToHash();
    RS = RouteState;

    $.ajax(
        "csstagged.json?" + Math.random()
    ).done(
        function ( css_dom ) {
            var css_info = processRules ( css_dom );
            CSSInfo = css_info;

            if ( is_style_guide && is_style_guide == true ) {
                React.render(
                    React.createElement(
                        StyleGuide,
                        {
                            css_info:css_info
                        }
                    ),
                    document.body
                );
            }else{
                React.render(
                    React.createElement(
                        CSSComp,
                        {
                            css_info:css_info
                        }
                    ),
                    document.body
                );
            }

        }
    );
};
