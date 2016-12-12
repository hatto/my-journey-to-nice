import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';
import ResultsStore from '../stores/ResultsStore';
import Profile      from './Profile.jsx';

var totalDuration = 0;

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

    if (activities.length) {
      for (let item of activities) {
          distance += item.distance;
      }
    }
    return Math.round(distance/1000, 2);
}

function getTotalTime(activities) {
    let time = 0;

    if (activities.length) {
      for (let item of activities) {
          time += item.moving_time;
      }
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
            cls = classNames('results-sport', 'results-sport--' + activity.sport),
            style = {
              height: activity.percentage + "%"
            }
            ;

        if (sport.length) {
            return (
                <div className={ cls }>
                    <div className="results-sport__content">
                        <div className="sport-total">
                            <div className="sport-total__title">{ activity.sport }</div>
                            <div className="sport-total__sessions">sessions: { sport.length }</div>
                            <div className="sport-total__hours">time: { getTimeFormat(activity.duration) }</div>
                            <div className="sport-total__distance">distance: { getTotalDistance(sport) }</div>
                            <div className="sport-total__graph">
                              <div className="sport-total__graph-cursor" style={ style } >
                                <span className="sport-total__graph-text">{ activity.percentage }%</span>
                              </div>
                            </div>
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
                percentage: 0
            },
            {
                activities: this.getSportData('run'),
                sport: 'run',
                duration: 0,
                percentage: 0
            },
            {
                activities: this.getSportData('swim'),
                sport: 'swim',
                duration: 0,
                percentage: 0
            },
            {
                activities: this.getSportData('other'),
                sport: 'other',
                duration: 0,
                percentage: 0
            }]
        ;

        totalDuration = 0;
        for (let item of activities) {
            item.duration = getTotalTime(item.activities);
            totalDuration += item.duration;
        }

        for (let item of activities) {
          item.percentage = Math.round(item.duration*100/totalDuration);
        }
        return (
            <div className="results-total__activities">
              { this.getSportInfo(activities[0]) }
              { this.getSportInfo(activities[1]) }
              { this.getSportInfo(activities[2]) }
              { this.getSportInfo(activities[3]) }
            </div>
        );
    },

    showProfile() {
      if (this.props.profile) {
        return (
            <Profile />
        )
      }
      return null
    },

    render: function() {
        let days = moment().diff(moment(this.props.startDate), 'days')
            ;

        return (
            <div className="wrap">
              <div className="results-total">
                  <div className="results-total__intro">

                    { this.showProfile() }

                    <div className="results-intro__description">
                      <div className="results-intro__title">Until today</div>
                      <div className="results-intro__stats">
                        <div className="results-intro__stats-col">
                          <div><span>Total days:</span> {days }</div>
                          <div><span>Total Sessions:</span> { this.state.data.length }</div>
                        </div>
                        <div className="results-intro__stats-col">
                          <div><span>Total time:</span> { getTimeFormat(getTotalTime(this.state.data)) }</div>
                          <div><span>Total distance:</span> { getTotalDistance(this.state.data) }km</div>
                        </div>
                      </div>
                    </div>
                  </div>
                { this.showSports() }
              </div>
            </div>
        );
    }
});

module.exports = ResultsTotal;
