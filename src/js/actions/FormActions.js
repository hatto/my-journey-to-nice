import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';

// Define action methods
var FormActions = {

    submitForm: function(data) {
        AppDispatcher.dispatch({
            type: Constants.SUBMIT,
            value: data
        });
    },

    receivedAPIError: function(data) {
        AppDispatcher.dispatch({
            type: Constants.API_ERROR,
            value: data
        })
    },

    success: function(data) {
        AppDispatcher.dispatch({
            type: Constants.API_SUCCESS,
            value: data
        })
    }

};

module.exports = FormActions;
