
var getCSSTaggedPlugin = require("./less-plugin-csstagged.js");

function LessPluginCSSTagged(options) {
    this.options = options;
}

LessPluginCSSTagged.prototype = {
    install: function(less, pluginManager) {
        var CSSTaggedPlugin = getCSSTaggedPlugin( less );
        pluginManager.addVisitor(new CSSTaggedPlugin(this.options));

        //pluginManager.addPreProcessor(new CSSTaggedPlugin(this.options));
    },
    printUsage: function () {
        console.log("RTL Plugin");
        console.log("use dir=RTL or dir=LTR")
    }
};

module.exports = LessPluginCSSTagged;
