import React        from 'react';
import classNames   from 'classnames';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
var InstagramPost = React.createClass({

    highlightHashtags: function(text) {
        return this.nl2br(text.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<strong>$2</strong>"));
    },

    nl2br: function(str) {
        var breakTag = '<br />';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },

    getCaption: function(photo) {
        if (photo.caption) {
            let cls = classNames({
                'instagram-post__content-text': true,
                'instagram-post__content-text--small': photo.caption.text.length > 150
            });
            return (
                <div
                    className={ cls }
                    dangerouslySetInnerHTML={{ __html: this.highlightHashtags(photo.caption.text) }}
                />
            );
        }
        return null;
    },

    render: function() {
        let photo = this.props.data;
        return (
            <div className="instagram-post">
                <div className="instagram-post__image">
                    <img
                        src={ photo.images.standard_resolution.url }
                        width={ photo.images.standard_resolution.width }
                        height={ photo.images.standard_resolution.height }
                    />
                </div>
                <div className="instagram-post__content">
                    { this.getCaption(photo) }
                </div>
            </div>
        );
    }
});

module.exports = InstagramPost;
