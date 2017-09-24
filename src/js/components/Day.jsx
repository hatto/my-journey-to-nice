import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';

import InstagramStore   from '../stores/InstagramStore';
import ResultsStore     from '../stores/ResultsStore';
import Format           from '../utils/Format';

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

    removeHastTags: function(text) {
        let textSplit = text.split(/[.]*[\r\n|\r|\n][.][\r\n|\r|\n][.][\r\n|\r|\n]/g);
        return textSplit[0];
    },

    getCaption: function(photo) {
        if (photo.caption) {
            return (
                <div className="day-photo__text">
                    { this.removeHastTags(photo.caption.text) }
                </div>
            );
        }
        return null;
    },

    showPhoto: function() {
        let photo = this.state.photo;
        if (photo) {
            if (photo.type == 'video') {
                return (
                    <div className="day-photo">
                        <video
                            className="day-photo__img"
                            poster={ photo.images.standard_resolution.url }
                            width={ photo.videos.low_resolution.width }
                            height={ photo.videos.low_resolution.height }
                            loop="true"
                            autoPlay="true"
                        >
                            <source src={ photo.videos.low_resolution.url } type="video/mp4"/>
                        </video>
                    </div>
                );
            }
            return (
                <div className="day-photo">
                    <img className="day-photo__img" src={ photo.images.standard_resolution.url } />
                </div>
            );
        }
        return null;
    },

    getSportInfoRow: function(info, label, unit) {
        if (info == null || info == 0) {
            return null;
        }
        return (
            <div className="sport__info">
                <span className='sport__info-label'>{ label }:</span>
                <span className='sport__info-value'>{ info }{ unit || "" }</span>
            </div>
        );
    },
    getSportInfo: function(sport) {
        let cls = classNames(
            'sport__image',
            'sport__image--' + sport.type.toLowerCase()
        );
        let url = "https://www.strava.com/activities/" + sport.id,
            distance = (sport.distance > 0) ? Math.round(sport.distance/1000,2) : null,
            speed = (sport.average_speed > 0) ? Math.round((sport.average_speed*3.6),2) : null,
            time = Format.getTimeFormat(sport.moving_time)
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
                    { this.getSportInfoRow(time, 'Time') }
                    { this.getSportInfoRow(distance, 'Distance', 'km') }
                    { this.getSportInfoRow(speed, 'Speed', 'km/h') }
                    { this.getSportInfoRow(sport.average_watts, 'Watts', 'watts') }
                    { this.getSportInfoRow(sport.total_elevation_gain, 'Elevation', 'm') }
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
