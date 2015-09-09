

var ColumnType = React.createClass({

    render: function() {
        return  <div className='columnType'>
                    <div className="column_Header">
                        Tags
                    </div>
                    <ColumnTypeList {...this.props} />
                </div>;
    }

});
