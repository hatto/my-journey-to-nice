import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';

// Define action methods
var ProfileActions = {
    receivedAPIError: function(data) {
        AppDispatcher.dispatch({
            type: Constants.FETCH_PROFILE_ERROR,
            value: data
        });
    },

    success: function(data) {
        AppDispatcher.dispatch({
            type: Constants.FETCH_PROFILE_SUCCESS,
            value: data
        });
    }

};

module.exports = ProfileActions;
