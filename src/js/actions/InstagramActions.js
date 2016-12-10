import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';

// Define action methods
var InstagramActions = {
    receivedAPIError: function(data) {
        AppDispatcher.dispatch({
            type: Constants.FETCH_PHOTOS_ERROR,
            value: data
        });
    },

    success: function(data) {
        AppDispatcher.dispatch({
            type: Constants.FETCH_PHOTOS_SUCCESS,
            value: data
        });
    }

};

module.exports = InstagramActions;
