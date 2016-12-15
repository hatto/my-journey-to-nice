import React            from 'react';
import vars             from 'vars';

var Footer = React.createClass({

    render: function() {
        return (
            <div className="wrap">
                <div className="footer">
                    <p className="footer-copyright">created by <a href="http://kracik.sk" target="_blank">pk</a></p>
                </div>
            </div>
        );
    }
});

module.exports = Footer;
