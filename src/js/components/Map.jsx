import React            from 'react';
import classNames       from 'classnames';
import vars             from 'vars';
import Waypoint         from 'react-waypoint';
import ReactGA          from 'react-ga';

import ResultsStore     from '../stores/ResultsStore';
import ResultsAction    from '../actions/ResultsActions';

var sentEvent = false;

function loadGoogleMapsApi() {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + vars.googlemaps.apikey + "&callback=initMap&libraries=geometry";
    script.async = true;
    document.body.appendChild(script);
}

function initMap() {
    ResultsAction.gmapLoaded();
}
window.initMap = initMap;

function drawMap(polyline) {
    var decodedPath = google.maps.geometry.encoding.decodePath(polyline);
    var myOptions = {
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: true,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var setRegion = new google.maps.Polyline({
        path: decodedPath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });

    // center map
    var bounds = new google.maps.LatLngBounds();
    var points = decodedPath;
    for (var n = 0; n < points.length ; n++){
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}


function getStateFromStores() {
    let state = ResultsStore.getMapState();
    if (state.map) {
        drawMap(state.map.polyline);
    }
    return state;
}

var Map = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    componentDidMount: function() {
        ResultsStore.addChangeListener(this._onChange);
        loadGoogleMapsApi();
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

    showPhoto: function() {

        if (this.state.photos && this.state.photos.primary) {
            return (
                <div className="map__image">
                    <img src={ this.state.photos.primary.urls['600'] } />
                </div>
            );
        }
        return null;
    },

    _handleWaypointEnter: function() {
        this.gaEvent('map');
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

    render: function() {
        if (this.state) {
            let typeClass = (this.state.type) ? 'map__activity--' + this.state.type.toLowerCase() : '';
            let cls = classNames('map__activity', typeClass);
            return (
                <div className="wrap">
                    <Waypoint
                        onEnter={this._handleWaypointEnter}
                    />
                    <div className="map__title">Last route.</div>
                    <div className="map">
                        <div className={ cls }>
                            <span className="map__activity-name">{ this.state.name }</span>
                            <span className="map__activity-info">{ Math.round(this.state.distance / 1000) }km</span>
                        </div>
                        <div id="map" className="map__placeholder"></div>
                        { this.showPhoto() }
                    </div>
                </div>
            );
        }
        return null;
    }
});

module.exports = Map;
