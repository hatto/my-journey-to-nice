import assign                   from 'object-assign';
import AppDispatcher            from '../dispatcher/AppDispatcher';
import Constants                from '../constants/Constants';
import FormActions              from '../actions/FormActions';

import Api                      from '../utils/Api';

const EventEmitter = require('events').EventEmitter;

var app = {
  data: {},
  errors: {},
  result: {}
};

function validate() {
  app.errors = {};

  let data = app.data,
      errors = app.errors
      ;

  if (!data) {
    return false;
  }
  if (!validateNotEmpty(data.firstName)) {
    errors.firstName = "Field can't be empty";
  }

  if (!validateNotEmpty(data.lastName)) {
    errors.lastName = "Field can't be empty";
  }

  if (!data.title) {
    errors.title = "Field can't be empty";
  }

  if (!validateNotEmpty(data.email)) {
    errors.email = "Field can't be empty";
  } else if (!validateEmail(data.email)) {
    errors.email = "Wrong email format";
  }

  if (!validateNotEmpty(data.phone)) {
    errors.phone = "Field can't be empty";
  } else if (!validatePhoneNumber(data.phone)) {
    errors.phone = "Wrong phone format";
  }

  if (Object.keys(errors).length === 0) {
    return true;
  }
  return false;
}

function validateNotEmpty(value) {
  return (value !== null && value.length > 0);
}

function validateEmail(value) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}

function validatePhoneNumber(value) {
  var re = /^\d+$/;
  return re.test(value);
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var FormStore = assign({}, EventEmitter.prototype, {

    getFormState: function() {
      return app;
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

        // Respond to CART_ADD action
        case Constants.SUBMIT:
            app.result = {};

            console.log('submit');
            console.log(action.value);
            app.data = action.value;
            if (validate()) {
              Api.sendData(app.data);
              // Api.sendData(app.data);
              console.log('send data')
            } else {
              console.log('errors');
              console.log(app.errors);
              FormStore.emitChange();
            }
            break;

        case Constants.API_ERROR:
          console.log('error');
          app.data = {};
          app.result = {
            data: action.value,
            valid: false
          };
          FormStore.emitChange();
          break;

        case Constants.API_SUCCESS:
          console.log('success');
          app.result = {
            data: action.value,
            valid: true
          };
          FormStore.emitChange();
          break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    FormStore.emitChange();

    return true;

});

module.exports = FormStore;
