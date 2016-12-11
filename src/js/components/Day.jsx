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
        return (
            <div key={ sport.id } className="sport">
                <div className={ cls }></div>
                <div className="sport__content">
                    <div className="sport__header">
                        <div className="sport__name">{ sport.name }</div>
                        <div className="sport__type">{ sport.type }</div>
                    </div>
                    <div className="sport__description">{ sport.description }</div>
                    <div className="sport__time">{ sport.moving_time }</div>
                    <div className="sport__distance">{ Math.round(sport.distance/1000,2) }km</div>
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
                <div className="day-results__empty">
                    day of repo
                </div>
            );
        } else {
            let cls = classNames(
                'day-results__list',
                'day-results__list--' + results.length
            );

            let sports = [];
            for (let item of results) {
                sports.push(this.getSportInfo(item));
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
                        <div className="day-results__title">My Yesterday</div>
                        { this.showResults() }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Day;