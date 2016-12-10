import React        from 'react';
import classNames   from 'classnames';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
var InstagramPost = React.createClass({

    getCaption: function(photo) {
        if (photo.caption) {
            return (
                <div>
                    { photo.caption.text }
                </div>
            );
        }
        return null;
    },

    render: function() {
        let photo = this.props.data;
        return (
            <div className="instagram-post">
                <img
                    src={ photo.images.standard_resolution.url }
                    width={ photo.images.standard_resolution.width }
                    height={ photo.images.standard_resolution.height }
                />
                { this.getCaption(photo) }
            </div>
        );
    }
});

module.exports = InstagramPost;
