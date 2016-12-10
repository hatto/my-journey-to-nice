import assign                   from 'object-assign';
import lodash                   from 'lodash';
import moment                   from 'moment';
import AppDispatcher            from '../dispatcher/AppDispatcher';
import Constants                from '../constants/Constants';
import ResultsActions           from '../actions/ResultsActions';

import StravaApi                from '../utils/StravaApi';

const EventEmitter = require('events').EventEmitter;

var app = {
  data: {},
  sports: [],
  bySport: {}
};

function storeData(data) {
    app.data = data;
    groupDatasBySport();
}

function getDataBySport(sport) {
    return app.bySport[sport];
}

function groupDatasBySport() {
    for (let activity of app.data) {
        addSport(activity.type);
        app.bySport[activity.type].push(activity);
    }
}

function filterByDate(activities, startDate, endDate) {
    let newArr = []
        ;
    for (let item of activities) {
        let dt = moment(item.start_date);
        if (dt.isBetween(startDate, endDate, null, '[]')) {
            newArr.push(item);
        }
    }

    return newArr;
}

/**
 * add sport to array of sports, uniq only
 * @param {String} sport    sport type
 */
function addSport(sport) {
    let sportsArr = app.sports;
    sportsArr.push(sport);
    app.sports = _.uniq(sportsArr);
    if (!app.bySport[sport]) {
        app.bySport[sport] = [];
    }
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var ResultsStore = assign({}, EventEmitter.prototype, {

    getResultsState: function() {
        return app;
    },

    getResultsTotalState: function() {
        return app;
    },

    getResults: function() {
        console.log('store: get results');
        StravaApi.getData();
    },

    getBySport: function(sports, startDate, endDate) {
        let retArr = [];
        if (Array.isArray(sports)) {
            for (let item of sports) {
                let activities = getDataBySport(item);
                retArr = _.merge(retArr, activities);
            }
        } else {
            retArr = getDataBySport(sports);
        }

        retArr = filterByDate(retArr, startDate, endDate);
        return retArr;
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

        case Constants.API_ERROR:
          console.log('error');

          ResultsStore.emitChange();
          break;

        case Constants.API_SUCCESS:
          storeData(action.value);

          ResultsStore.emitChange();
          break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    ResultsStore.emitChange();

    return true;

});

module.exports = ResultsStore;
