import React        from 'react';
import classNames   from 'classnames';
import ResultsStore from '../stores/ResultsStore';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return ResultsStore.getResultsTotalState();
}

function getTotalDistance(activities) {
    let distance = 0;
    for (let item of activities) {
        distance += item.distance;
    }
    return Math.round(distance/1000, 2);
}

function getTotalTime(activities) {
    let time = 0;
    for (let item of activities) {
        time += item.moving_time;
    }
    time = Math.floor(time/60);
    let hours = Math.floor(time/60);
    let mins = time%60;
    mins = (mins < 10) ? "0"+mins : mins;
    let timeString = hours + "h" + mins;
    return timeString;
}

var ResultsTotal = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ResultsStore.addChangeListener(this._onChange);
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        ResultsStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores());
    },

    getSportData: function(sport) {
        let sportsArr = null;
        switch(sport) {
            case 'bike':
                sportsArr = ['Ride', 'VirtualRide']
                break;
            case 'run':
                sportsArr = ['Run']
                break;
            case 'swim':
                sportsArr = ['Swim']
                break;
            case 'other':
                sportsArr = ['Yoga', 'Workout']
                break;
            default:
                break;
        }
        let activities = ResultsStore.getBySport(sportsArr, this.props.startDate, this.props.endDate);
        return activities;
    },

    getSportInfo: function(sport) {
        let activities = this.getSportData(sport);
        if (!activities) {
            return null;
        }

        let cls = classNames('sport', 'sport--'+sport);
        return (
            <div className="{ cls }">
                <div className="sport__sessions">sessions: { activities.length }</div>
                <div className="sport__hours">time: { getTotalTime(activities) }</div>
                <div className="sport__distance">distance: { getTotalDistance(activities) }</div>
            </div>
        );
    },

    render: function() {
        return (
            <div className="results-total">
                <div className="results-total__info results-total__info--bike">bike: { this.getSportInfo('bike') }</div>
                <div className="results-total__info results-total__info--run">run: { this.getSportInfo('run') }</div>
                <div className="results-total__info results-total__info--swim">swim: { this.getSportInfo('swim') }</div>
                <div className="results-total__info results-total__info--other">other: { this.getSportInfo('other') }</div>
            </div>
        );
    }
});

module.exports = ResultsTotal;
