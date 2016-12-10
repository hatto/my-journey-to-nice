import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

import InstagramStore from '../stores/InstagramStore'

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

    render: function() {
        return (
            <div className="instagram">
            </div>
        );
    }
});

module.exports = Instagram;
