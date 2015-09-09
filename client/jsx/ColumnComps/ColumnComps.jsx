

var ColumnComps = React.createClass({

    render: function() {

        return  <div className='columnComps'>
                    <div className="column_Header">
                        Root Rules
                    </div>
                    <ColumnCompsList
                        {...this.props} />
                </div>;

    }

});
