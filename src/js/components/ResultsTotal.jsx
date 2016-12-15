import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';
import lodash       from 'lodash';
import Waypoint     from 'react-waypoint';
import ReactGA      from 'react-ga';

import ResultsStore   from '../stores/ResultsStore';
import ResultsActions from '../actions/ResultsActions';

import Profile        from './Profile.jsx';
import Format         from '../utils/Format';

var totalDuration = 0;
var sentEvent = false;
/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores(startDate, endDate) {
    return ResultsStore.getResultsState(startDate, endDate);
}

var ResultsTotal = React.createClass({

    getInitialState: function() {
        return getStateFromStores(this.props.startDate, this.props.endDate);
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
        this.setState(getStateFromStores(this.state.startDate, this.state.endDate));
    },

    infoDistance: function(distance) {
      if (distance > 0) {
        return (
            <div className="sport-total__distance">
                <span className="sport-total__label">distance:</span>
                <span className="sport-total__value">{ distance }km</span>
            </div>
        );
      }
      return null;
    },

    infoListTypes: function(activities) {
      let types = [],
          rows = []
          ;
      if (activities.length) {
        for (let item of activities) {
          types.push(item.type);
        }
      } else {
        return null;
      }

      types = _.uniq(types);
      let i = 0;
      for (let item of types) {
        i++;
        rows.push(
          <p key={ i } className="sport-total__types-item">{ item }</p>
        );
      }

      return (
        <div className="sport-total__types">
            <span className="sport-total__label">types:</span>
            { rows }
        </div>
      );
    },

    _handleWaypointEnter: function() {
        this.gaEvent(this.props.type);
        this.setState({
            shown: true
        });
    },

    getSportInfo: function(sport) {
        let activities = sport.activities,
            cls = classNames('results-sport', 'results-sport--' + sport.type, { 'results-sport--shown': this.state.shown}),
            time = (activities) ? Format.getTimeFormat(sport.duration) : 0,
            sessions = activities.length,
            style = {
              height: sport.percentage + "%"
            }
            ;

        return (
            <div className={ cls }>
                <Waypoint
                    onEnter={this._handleWaypointEnter}
                />
                <div className="results-sport__content">
                    <div className="sport-total">
                        <div className="sport-total__title">{ sport.type }</div>
                        <div className="sport-total__sessions">
                            <span className="sport-total__label">sessions:</span>
                            <span className="sport-total__value">{ sessions }</span>
                        </div>
                        <div className="sport-total__hours">
                            <span className="sport-total__label">time:</span>
                            <span className="sport-total__value">{ time }</span>
                        </div>
                        { this.infoDistance(Format.getTotalDistance(activities)) }
                        <div className="sport-total__graph">
                          <div className="sport-total__graph-cursor" style={ style } >
                            <span className="sport-total__graph-text">{ sport.percentage }%</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    showSports: function() {
        if (!this.state.sports) {
          return null;
        }
        let sports = [{
            activities: this.state.sports.bike || [],
            type: 'bike',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.run || [],
            type: 'run',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.swim || [],
            type: 'swim',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.other || [],
            type: 'other',
            duration: 0,
            percentage: 0
        }]
        ;

        totalDuration = 0;
        for (let item of sports) {
            item.duration = Format.getTotalTime(item.activities);
            totalDuration += item.duration;
        }

        for (let item of sports) {
          item.percentage = (totalDuration > 0) ? Math.round(item.duration*100/totalDuration) : 0;
        }

        return (
            <div className="results-total__activities">
              { this.getSportInfo(sports[0]) }
              { this.getSportInfo(sports[1]) }
              { this.getSportInfo(sports[2]) }
              { this.getSportInfo(sports[3]) }
            </div>
        );
    },

    gaEvent(eventLabel) {
        if (!sentEvent) {
            ReactGA.event({
              category: 'section',
              action: 'scrolled to section',
              label: eventLabel
            });
            sentEvent = true;
        }
    },

    addPagination: function() {
      let dateText = moment(this.state.startDate).format('DD/MM/YYYY') + " - " + moment(this.state.endDate).format('DD/MM/YYYY')
          ;

      return (
          <div className="pagination">
              <div className="pagination__date">{ dateText }</div>
              <button className="pagination__arrow pagination__arrow--prev" onClick={ () => { this.week(-1) } } >previous</button>
              <button className="pagination__arrow pagination__arrow--next" onClick={ () => { this.week(1) } } >next</button>
          </div>
      );
    },

    week: function(changeInt) {
      let newStartDate = moment(this.state.startDate).add((7*changeInt), 'days').format("YYYY-MM-DD");
      let newEndDate = moment(this.state.endDate).add((7*changeInt), 'days').format("YYYY-MM-DD");
      this.setState({
        startDate: newStartDate,
        startDate: newEndDate
      });
      this.setState(getStateFromStores(newStartDate, newEndDate));
    },

    render: function() {
        let days = moment().diff(moment(this.state.startDate), 'days'),
            title = (this.props.type === "all") ? "Until today." : "My week.",
            pagination = (this.props.type === "all") ? null : this.addPagination()
            ;

        days = (days < 1) ? 0 : days;

        return (
            <div className="wrap">
              <div className="results-total">
                  <div className="results-total__intro">

                    <div className="results-intro__description">
                      <div className="results-intro__title">{ title }</div>

                      { pagination }

                      <div className="results-intro__stats">
                        <div className="results-intro__stats-col">
                          <div><span>Total days:</span><strong>{ days }</strong></div>
                          <div><span>Total Sessions:</span><strong>{ this.state.all.length }</strong></div>
                        </div>
                        <div className="results-intro__stats-col">
                          <div><span>Total time:</span><strong>{ Format.getTimeFormat(Format.getTotalTime(this.state.all)) }</strong></div>
                          <div><span>Total distance:</span><strong>{ Format.getTotalDistance(this.state.all) }km</strong></div>
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
