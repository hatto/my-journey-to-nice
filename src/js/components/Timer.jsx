import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

var finalTime = moment("2017-07-23 6:30", "YYYY-MM-DD HH:mm");

var Timer = React.createClass({
    getInitialState: function() {
        return {
            currentTime: moment()
        };
    },

    fromNow: function() {
        let duration = moment.duration(finalTime.diff(this.state.currentTime)),
            timer = ""
            ;

        let days = duration.asDays(),
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
            <div className="timer__clock">{ weeks }{weeksLabel} {days}{daysLabel} {hours}:{minutes}:{seconds} </div>
        );
    },

    refreshDate() {
        setTimeout( () => {
            this.setState({
                currentTime: moment()
            });
        }, 1000);
    },

    render: function() {
        return (
            <div className="timer">
                { this.fromNow() }
            </div>
        );
    }
});

module.exports = Timer;
