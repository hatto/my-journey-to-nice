import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

import InstagramStore   from '../stores/InstagramStore';
import InstagramPost    from './InstagramPost.jsx';

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
            let rows = [];
            let index = 0;
            for (let photo of this.state.photos) {
                index++;
                rows.push( <InstagramPost key={ index } data={photo} /> );
            }
            return rows;
        }
        return null;
    },

    render: function() {
        return (
            <div className="instagram">
                { this.getPosts() }
            </div>
        );
    }
});

module.exports = Instagram;
