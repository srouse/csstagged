

var StyleGuide = React.createClass({

    render: function() {



        return  <div className="styleGuide">
                    <div className="styleGuide_nav">
                        <StyleGuideNav />
                    </div>
                    <div className="styleGuide_content">
                        <VariablesPage />
                    </div>
                </div>;
    }
});
