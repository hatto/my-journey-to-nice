import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

import InstagramStore from '../stores/InstagramStore';
import ResultsStore from '../stores/ResultsStore';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    let yesterday = moment().subtract('1', 'days');
    return {
        day: ResultsStore.getDay(yesterday),
        photo: InstagramStore.getLastPhoto()
    }
}

function formatTime(time) {
    time = Math.floor(time/60);
    let hours = Math.floor(time/60);
    let mins = time%60;
    mins = (mins < 10) ? "0"+mins : mins;
    let timeString = hours + "h" + mins;
    return timeString;
}

var Day = React.createClass({
    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        InstagramStore.addChangeListener(this._onChange);
        ResultsStore.addChangeListener(this._onChange);
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        InstagramStore.removeChangeListener(this._onChange);
        ResultsStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores());
    },

    getCaption: function(photo) {
        if (photo.caption) {
            return (
                <div className="day-photo__text">
                    { photo.caption.text }
                </div>
            );
        }
        return null;
    },

    showPhoto: function() {
        let photo = this.state.photo;
        if (photo) {
            return (
                <div className="day-photo">
                    <img className="day-photo__img" src={ photo.images.standard_resolution.url } />
                    { this.getCaption(photo) }
                </div>
            );
        }
        return null;
    },

    getSportInfo: function(sport) {
        let cls = classNames(
            'sport__image',
            'sport__image--' + sport.type.toLowerCase()
        );
        let url = "https://www.strava.com/activities/" + sport.id;
        let distance = (sport.distance > 0) ? "Distance: " + Math.round(sport.distance/1000,2)+ "km" : null,
            speed = (sport.average_speed > 0) ? "Speed: " + Math.round((sport.average_speed*3.6),2) + "km/h" : null,
            watts = (sport.average_watts > 0) ? "Watts: " + sport.average_watts : null,
            elev = (sport.elev_height > 0) ? "Elevation: " + sport.elev_height + "m" : null,
            time = formatTime(sport.moving_time)
            ;

        return (
            <div key={ sport.id } className="sport">
                <div className={ cls }></div>
                <div className="sport__content">
                    <div className="sport__header">
                        <div className="sport__name">{ sport.name }</div>
                        <div className="sport__type">{ sport.type }</div>
                    </div>
                    <div className="sport__description">{ sport.description }</div>
                    <div className="sport__time">time: { time }</div>
                    <div className="sport__info">{ distance }</div>
                    <div className="sport__info">{ speed }</div>
                    <div className="sport__info">{ watts }</div>
                    <div className="sport__info">{ elev }</div>
                    <a  className="sport__link" target="_blank" href={ url }>+ details</a>
                </div>
            </div>
        );
    },

    showResults: function() {
        let results = this.state.day
            ;

        if (results.length == 0) {
            return (
                <div className="day-results__list">
                    <div className="sport">
                        <div className="sport__image sport__image--rest"></div>
                        <div className="sport__content">
                            <div className="sport__header">
                                <div className="sport__name">The Rest day</div>
                                <div className="sport__type">or I was just lazy</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            let cls = classNames(
                'day-results__list',
                'day-results__list--' + results.length
            );

            let sports = [];
            for (let item of results) {
                if (sports.length < 3) {
                    sports.push(this.getSportInfo(item));
                }
            }
            return (
                <div className={ cls }>
                    { sports }
                </div>
            );
        }
        return null;
    },

    render: function() {
        return (
            <div className="wrap">
                <div className="day">
                    { this.showPhoto() }

                    <div className="day-results">
                        <div className="day-results__title">Yesterday.</div>
                        { this.showResults() }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Day;
