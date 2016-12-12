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
    return time;
}

function getTimeFormat(time) {
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

    getSportInfo: function(activity) {
        let sport = activity.activities,
            cls = classNames('results-sport', 'results-sport--' + activity.sport, 'results-sport--order-' + activity.order)
            ;
        if (sport.length) {
            return (
                <div className={ cls }>
                    <div className="results-sport__content">
                        <div className="sport">
                            <div className="sport__sessions">sessions: { sport.length }</div>
                            <div className="sport__hours">time: { getTimeFormat(activity.duration) }</div>
                            <div className="sport__distance">distance: { getTotalDistance(sport) }</div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    },

    showSports: function() {
        let activities = [{
                activities: this.getSportData('bike'),
                sport: 'bike',
                duration: 0,
                order: 0
            },
            {
                activities: this.getSportData('run'),
                sport: 'run',
                duration: 0,
                order: 0
            },
            {
                activities: this.getSportData('swim'),
                sport: 'swim',
                duration: 0,
                order: 0
            },
            {
                activities: this.getSportData('other'),
                sport: 'other',
                duration: 0,
                order: 0
            }]
        ;

        for (let item of activities) {
            item.duration = getTotalTime(item.activities);
        }

        for (let item1 of activities) {
            for (let item2 of activities) {
                if (item1.duration > item2.duration) {
                    item1.order++;
                }
            }
        }
        console.log(activities);
        return (
            <div className="results-total">
                { this.getSportInfo(activities[0]) }
                { this.getSportInfo(activities[1]) }
                { this.getSportInfo(activities[2]) }
                { this.getSportInfo(activities[3]) }
            </div>
        );
    },

    render: function() {
        return (
            <div className="wrap">
                { this.showSports() }
            </div>
        );
    }
});

module.exports = ResultsTotal;
