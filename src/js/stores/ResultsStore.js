import assign                   from 'object-assign';
import lodash                   from 'lodash';
import moment                   from 'moment';

import AppDispatcher            from '../dispatcher/AppDispatcher';
import Constants                from '../constants/Constants';
import ResultsActions           from '../actions/ResultsActions';

import StravaApi                from '../utils/StravaApi';

const EventEmitter = require('events').EventEmitter;

const minDate = "2016-11-28",
    maxDate = "2017-07-22"
    ;

var app = {
  data: {},
  sports: {},
  dates: {
    min: moment("2016-11-28"),
    max: moment("2018-07-22"),
    currentMin: moment().day(-6),
    currentMax: moment().day(0)
  }
};

var mapActivity = {};

function storeData(data) {
    app.data = data;
}

function getDataBySport(sport) {
    return app.sports[sport];
}

function getSports(activities) {
    let sports = {};
    if (activities.length) {
        for (let activity of activities) {
            switch(activity.type) {
                case 'Ride':
                    if (!sports['bike']) { sports['bike'] = []; }
                    sports['bike'].push(activity);
                    break;

                case 'VirtualRide':
                    if (!sports['bike']) { sports['bike'] = []; }
                    sports['bike'].push(activity);
                    break;

                case 'Run':
                    if (!sports['run']) { sports['run'] = []; }
                    sports['run'].push(activity);
                    break;

                case 'Swim':
                    if (!sports['swim']) { sports['swim'] = []; }
                    sports['swim'].push(activity);
                    break;

                default:
                    if (!sports['other']) { sports['other'] = []; }
                    sports['other'].push(activity);
                    break;
            }
        }
    }
    return sports;
}

function filterByDate(activities, startDate, endDate) {
    let newArr = [],
        endDateMoment = moment(endDate).add(1, 'days')
        ;

    if (activities.length) {
        for (let item of activities) {
            let dt = moment(item.start_date);
            if (dt.isBetween(startDate, endDateMoment, 'day', '[)')) {
                newArr.push(item);
            }
        }
    }

    return newArr;
}

function getByDay(day) {
    let sportsArr = app.data,
        yesterday = []
        ;
    if (sportsArr.length) {
        for (let item of sportsArr) {
            let date = moment(item.start_date);
            if (day.isSame(date, 'day')) {
                yesterday.push(item);
            }
        }
    }

    return yesterday;
}

/**
 * get last item from results with a map
 * @return {Object}   result object
 */
function getLastWithMap() {
  if (app.data.length) {
    for (let i=app.data.length-1; i>=0; i--) {
      if (app.data[i].map.summary_polyline) {
        return app.data[i];
      }
    }
  }
  return null;
}

// Extend Cart Store with EventEmitter to add eventing capabilities
var ResultsStore = assign({}, EventEmitter.prototype, {

    getResultsState: function(startDate, endDate) {
        let allActivities = filterByDate(app.data, startDate, endDate),
            sports = getSports(allActivities)
            ;
        return {
            sports:     sports,
            all:        allActivities,
            startDate:  startDate,
            endDate:    endDate
        };
    },

    getResultsTotalState: function() {
        return app;
    },

    getMapState: function() {
        return mapActivity;
    },

    getResults: function() {
        StravaApi.getData();
    },

    getBySport: function(sport, startDate, endDate) {
        let retArr = filterByDate(app.sports[sport], startDate, endDate);
        return retArr;
    },

    getDay: function(day) {
        return getByDay(day);
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
          let lastactivity = getLastWithMap();
          if (lastactivity) {
            StravaApi.getActivity(lastactivity.id);
          }
          ResultsStore.emitChange();
          break;

        case Constants.GMAP_LOADED:
          let activity = getLastWithMap();
          if (activity) {
            StravaApi.getActivity(activity.id);
          }
          break;

        case Constants.FETCHED_ACTIVITY:
          mapActivity = action.value;
          ResultsStore.emitChange();
          break;

          ResultsStore.emitChange();
          break;

        case Constants.CHANGE_DATES:
          app.data.currentMin = action.value.start;
          app.data.currentMax = action.value.end;

          ResultsStore.emitChange();
          break;

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
