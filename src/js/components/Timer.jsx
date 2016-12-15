import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';
import ReactGA      from 'react-ga';

var finalTime = moment("2017-07-23 6:30", "YYYY-MM-DD HH:mm");

var Timer = React.createClass({
    getInitialState: function() {
        return {
            currentTime: moment()
        };
    },

    fromNow: function() {
        let duration = moment.duration(finalTime.diff(this.state.currentTime)),
            days = duration.asDays(),
            hours = duration.hours(),
            minutes = duration.minutes(),
            seconds = duration.seconds(),
            weeks = Math.floor(days/7)
            ;
        days = Math.floor(days%7);
        hours = (hours < 10) ? '0'+hours : hours;
        minutes = (minutes < 10) ? '0'+minutes : minutes;
        seconds = (seconds < 10) ? '0'+seconds : seconds;

        let weeksLabel = (weeks > 1) ? 'weeks' : 'week',
            daysLabel = (days > 1) ? 'days' : 'day'
            ;

        this.refreshDate();
        return (
            <div className="timer__clock">
                in<span className="timer__clock-weeks">
                    <strong>{ weeks }</strong>{weeksLabel}
                </span>
                <span className="timer__clock-days">
                    <strong>{ days }</strong>{daysLabel}
                </span>
                <span className="timer__clock-hours">
                    <strong>{hours}:{minutes}</strong>:{seconds}
                </span>
            </div>
        );
    },

    refreshDate() {
        setTimeout( () => {
            this.setState({
                currentTime: moment()
            });
        }, 1000);
    },

    clickHandler(eventLabel) {
        ReactGA.event({
          category: 'links',
          action: 'click link',
          label: eventLabel
        });
    },

    render: function() {
        return (
            <div className="header">
                <div className="header__filter"></div>
                <div className="timer">
                    <h1 className="timer__title"><strong>#</strong>my journey to</h1>
                    <div className="timer__logo">
                        <img src="./images/logo.png" className="timer__logo-img" />
                    </div>

                    { this.fromNow() }

                    <div className="header__links">
                        <a
                            className="header__links-item"
                            onClick={() => {this.clickHandler('strava')}}
                            target="_blank"
                            href="https://www.strava.com/athletes/5857494">
                                <img src="./images/logo_strava.svg" />
                        </a>
                        <a
                            className="header__links-item"
                            onClick={() => {this.clickHandler('instagram')}}
                            target="_blank"
                            href="https://www.instagram.com/peterkracik/">
                                <img src="./images/logo_instagram.svg" />
                        </a>
                        <a
                            className="header__links-item"
                            onClick={() => {this.clickHandler('github')}}
                            target="_blank"
                            href="https://github.com/hatto/my-journey-to-nice">
                                <img src="./images/logo_github.svg" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Timer;
