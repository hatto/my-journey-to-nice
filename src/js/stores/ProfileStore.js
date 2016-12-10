import assign                   from 'object-assign';
import AppDispatcher            from '../dispatcher/AppDispatcher';
import Constants                from '../constants/Constants';
import ProfileActions           from '../actions/ProfileActions';

import StravaApi                from '../utils/StravaApi';

const EventEmitter = require('events').EventEmitter;

var app = {
  profile: {}
};

// Extend Cart Store with EventEmitter to add eventing capabilities
var ProfileStore = assign({}, EventEmitter.prototype, {

    getProfileState: function() {
        return app;
    },

    getProfile: function() {
        console.log('store: get profile');
        StravaApi.getProfile();
    },


    // Emit Change event
    emitChange: function() {
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register callback with AppDispatcher
AppDispatcher.register(function(action) {
    switch (action.type) {

        case Constants.FETCH_PROFILE_SUCCESS:
          app.profile = action.value;

          ProfileStore.emitChange();
          break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    ProfileStore.emitChange();

    return true;

});

module.exports = ProfileStore;
