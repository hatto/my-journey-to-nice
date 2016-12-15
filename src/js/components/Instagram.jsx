import React            from 'react';
import classNames       from 'classnames';
import moment           from 'moment';
import Waypoint         from 'react-waypoint';
import ReactGA          from 'react-ga';

import InstagramStore   from '../stores/InstagramStore';
import InstagramPost    from './InstagramPost.jsx';

var masonryOptions = {
    transitionDuration: 0
};
var sentEvent = false;

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return InstagramStore.getInstagramState();
}

var Instagram = React.createClass({
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        InstagramStore.addChangeListener(this._onChange);
        InstagramStore.getPhotos();
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        InstagramStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores());
    },

    getPosts: function() {
        if (this.state.photos.length) {
            let rows = [],
                index = 0,
                colors = ['white', 'red', 'black']
                ;
            for (let photo of this.state.photos) {
                index++;
                let size = (index%3 == 0) ? 'portrait' : 'landscape',
                    position = 'top',
                    cls = classNames([
                        'instagram__item',
                        'instagram__item--masonry',
                        'instagram__item--' + size,
                        'instagram__item--' + position,
                        'instagram__item--' + colors[Math.floor(Math.random()*colors.length)]
                    ])
                    ;

                rows.push(
                    <div key={ index } className={ cls }>
                        <InstagramPost data={photo} />
                    </div>
                );
            }
            return rows;
        }
        return null;
    },

    _handleWaypointEnter: function() {
        this.gaEvent('instagram');
    },

    gaEvent(eventLabel) {
        if (!sentEvent) {
            ReactGA.event({
              category: 'section',
              action: 'scrolled to section',
              label: eventLabel
            });
            sentEvent = true;
        }
    },

    render: function() {
        return (
            <div className="wrap">
                <Waypoint
                    onEnter={this._handleWaypointEnter}
                />
                <div className="instagram">
                    <p className="instagram__title">From my instagram.</p>
                    <div className="instagram__wrap">
                        { this.getPosts() }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Instagram;
