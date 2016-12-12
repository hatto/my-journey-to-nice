import React            from 'react';
import classNames       from 'classnames';
import vars             from 'vars';

import ResultsStore     from '../stores/ResultsStore';
import ResultsAction    from '../actions/ResultsActions';


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
        drawMap(state.map.summary_polyline);
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

    render: function() {
        if (this.state) {
            return (
                <div className="wrap">
                    <div className="map__title">Last route.</div>
                    <div className="map">
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
