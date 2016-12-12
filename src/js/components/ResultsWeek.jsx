import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';
import lodash       from 'lodash';
import ResultsStore from '../stores/ResultsStore';
import Profile      from './Profile.jsx';
import Format       from '../utils/Format'

var totalDuration = 0;
var allActivities = [];
/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return ResultsStore.getResultsTotalState();
}

var ResultsWeek = React.createClass({

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
        _.merge(allActivities, activities);
        return activities;
    },

    infoDistance: function(distance) {
      if (distance > 0) {
        return <div className="sport-total__distance">distance: { distance }km</div>
      }
      return null;
    },

    infoListTypes: function(activities) {
      let types = [],
          rows = []
          ;
      if (activities.length) {
        for (let item in activities) {
          types.push(item.type);
        }
      } else {
        return null;
      }

      types = _.uniq(types);
      let i = 0;
      for (let item in types) {
        i++;
        rows.push(
          <p key={ i } className="sport-total__types-item">{ item }</p>
        );
      }

      return (
        <div className="sport-total__types">
          types:
          { rows }
        </div>
      );
    },

    getSportInfo: function(activity) {
        let sport = activity.activities,
            cls = classNames('week-sport', 'week-sport--' + activity.sport),
            style = {
              height: activity.percentage + "%"
            }
            ;

        let time = (activity.length) ? Format.getTimeFormat(activity.duration) : 0,
            sessions = (activity.length) ? activity.length : 0
            ;

        return (
            <div className={ cls }>
                <div className="week-sport__content">
                    <div className="sport-total">
                        <div className="sport-total__title">{ activity.sport }</div>
                        <div className="sport-total__sessions">sessions: { sessions }</div>
                        <div className="sport-total__hours">time: { time }</div>
                        { this.infoDistance(Format.getTotalDistance(sport)) }
                        { this.infoListTypes(sport) }
                        <div className="sport-total__graph">
                          <div className="sport-total__graph-cursor" style={ style } >
                            <span className="sport-total__graph-text">{ activity.percentage }%</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    showSports: function() {
      allActivities = [];
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
            item.duration = Format.getTotalTime(item.activities);
            totalDuration += item.duration;
        }

        for (let item of activities) {
          item.percentage = (totalDuration > 0) ? Math.round(item.duration*100/totalDuration) : 0;
        }

        return (
            <div className="week-total__activities">
              { this.getSportInfo(activities[0]) }
              { this.getSportInfo(activities[1]) }
              { this.getSportInfo(activities[2]) }
              { this.getSportInfo(activities[3]) }
            </div>
        );
    },

    render: function() {
        let days = moment().diff(moment(this.props.startDate), 'days')
            ;

        return (
            <div className="wrap">
              <div className="week-total">
                  <div className="week-total__intro">

                    <div className="week-intro__description">
                      <div className="week-intro__title">My week.</div>
                      <div className="week-intro__stats">
                        <div className="week-intro__stats-col">
                          <div><span>Total days:</span><strong>{days }</strong></div>
                          <div><span>Total Sessions:</span><strong>{ allActivities.length }</strong></div>
                        </div>
                        <div className="week-intro__stats-col">
                          <div><span>Total time:</span><strong>{ Format.getTimeFormat(Format.getTotalTime(allActivities)) }</strong></div>
                          <div><span>Total distance:</span><strong>{ Format.getTotalDistance(allActivities) }km</strong></div>
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

module.exports = ResultsWeek;
