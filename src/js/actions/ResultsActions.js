import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';

// Define action methods
var ResultsActions = {
    receivedAPIError: function(data) {
        AppDispatcher.dispatch({
            type: Constants.API_ERROR,
            value: data
        });
    },

    success: function(data) {
        AppDispatcher.dispatch({
            type: Constants.API_SUCCESS,
            value: data
        });
    },

    successActivity: function(data) {
        AppDispatcher.dispatch({
            type: Constants.FETCHED_ACTIVITY,
            value: data
        });
    },

    gmapLoaded: function() {
        AppDispatcher.dispatch({
            type: Constants.GMAP_LOADED
        });
    },

    changeDates: function(newStartDate, newEndDate) {
      AppDispatcher.dispatch({
          type: Constants.CHANGE_DATES,
          value: {
            start: newStartDate,
            end: newEndDate
          }
      });
    }

};

module.exports = ResultsActions;
