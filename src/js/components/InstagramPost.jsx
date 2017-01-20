import React        from 'react';
import classNames   from 'classnames';
import Waypoint     from 'react-waypoint';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
var InstagramPost = React.createClass({

    getInitialState: function() {
        return {
            shown: false
        };
    },

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

    _handleWaypointEnter: function() {
        this.setState({
            shown: true
        });
    },

    getMedia: function(photo) {
        if (photo.type == "video") {
            return (
                <div className="instagram-post__image instagram-post__image--video">
                    <video
                        poster={ photo.images.standard_resolution.url }
                        width={ photo.videos.low_resolution.width }
                        height={ photo.videos.low_resolution.height }
                        loop="true"
                        autoPlay="true"
                    >
                        <source src={ photo.videos.low_resolution.url } type="video/mp4"/>
                    </video>
                </div>
            );
        }
        return (
            <div className="instagram-post__image">
                <img
                    src={ photo.images.standard_resolution.url }
                    width={ photo.images.standard_resolution.width }
                    height={ photo.images.standard_resolution.height }
                />
            </div>
        );
    },

    render: function() {
        let photo = this.props.data,
            cls = classNames({
                'instagram-post': true,
                'instagram-post--shown': this.state.shown
            })
            ;

        return (
            <a href={ photo.link } target="_blank" className={ cls }>
                <Waypoint
                    onEnter={this._handleWaypointEnter}
                />
                { this.getMedia(photo) }

                <div className="instagram-post__content">
                    { this.getCaption(photo) }
                </div>
            </a>
        );
    }
});

module.exports = InstagramPost;
