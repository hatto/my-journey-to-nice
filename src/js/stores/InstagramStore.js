import assign                   from 'object-assign';
import AppDispatcher            from '../dispatcher/AppDispatcher';
import Constants                from '../constants/Constants';
import InstagramActions         from '../actions/InstagramActions';

import InstagramApi             from '../utils/InstagramApi';

const EventEmitter = require('events').EventEmitter;

var app = {
  photos: {}
};

function filterPhotos(photos) {
    let selected = [];
    if (photos.length) {
        for (let item of photos) {
            if (item.caption && item.caption.text.indexOf('myjourneytoironman') > -1) {
                selected.push(item);
            }
        }
    }
    return selected;
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var InstagramStore = assign({}, EventEmitter.prototype, {

    getInstagramState: function() {
        return app;
    },

    getPhotos: function() {
        console.log('store: get photos');
        InstagramApi.getPhotos();
    },

    getLastPhoto: function() {
        if (app.photos.length) {
            return app.photos[0];
        }
        return null;
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

        case Constants.FETCH_PHOTOS_SUCCESS:
          app.photos = filterPhotos(action.value);

          InstagramStore.emitChange();
          break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    InstagramStore.emitChange();

    return true;

});

module.exports = InstagramStore;
