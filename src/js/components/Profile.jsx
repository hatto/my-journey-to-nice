import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

import ProfileStore from '../stores/ProfileStore'

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return ProfileStore.getProfileState();
}

var Profile = React.createClass({
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ProfileStore.addChangeListener(this._onChange);
        ProfileStore.getProfile();
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        ProfileStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores());
    },

    render: function() {
        let profile = this.state.profile;
        return (
            <div className="profile">
                <img src={profile.profile} />
                <p>{ profile.username }</p>
            </div>
        );
    }
});

module.exports = Profile;
