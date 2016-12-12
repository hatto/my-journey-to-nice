import React        from 'react';
import classNames   from 'classnames';
import ResultsStore from '../stores/ResultsStore';
import moment       from 'moment';

import ResultsTotal from './ResultsTotal.jsx';
import Map          from './Map.jsx';

/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores() {
    return ResultsStore.getResultsState();
}

const minDate = "2016-11-28",
    maxDate = "2017-07-22"
    ;
let curentWeekStart = moment().day(1).format("YYYY-MM-DD"),
    curentWeekEnd = moment().day(1).add(6, 'days').format("YYYY-MM-DD");

let dates = {
    min: moment("2016-11-28"),
    max: moment("2017-07-22"),
    currentMin: moment().day(1),
    currentMax: moment().day(7)
};

var Results = React.createClass({

    getInitialState: function() {
        return {
            min: moment("2016-11-28"),
            max: moment("2017-07-22"),
            currentMin: moment().day(1),
            currentMax: moment().day(7)
        };
    },

    componentDidMount: function() {
        ResultsStore.addChangeListener(this._onChange);
        ResultsStore.getResults();
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

    addPagination: function() {
        return (
            <div className="pagination">
                <button className="pagination__arrow pagination__arrow--prev" onClick={ () => { this.week(-1) } } >previous</button>
                <button className="pagination__arrow pagination__arrow--next" onClick={ () => { this.week(1) } } >next</button>
            </div>
        );
    },

    week: function(changeInt) {

        this.setState({
            currentMin: this.state.currentMin.add((7*changeInt), 'days'),
            currentMax: this.state.currentMax.add((7*changeInt), 'days')
        });
    },

    render: function() {
        let dates = this.state;

        let map = (this.state.data && this.state.data.length) ? <Map /> : null;
        return (
            <div className="results">
                <ResultsTotal startDate={ dates.min.format("YYYY-MM-DD") } endDate={ dates.max.format("YYYY-MM-DD") } profile={ true } />
                { map }
                <ResultsTotal startDate={ dates.currentMin.format("YYYY-MM-DD") } endDate={ dates.currentMax.format("YYYY-MM-DD") } />
            </div>
        );
    }
});

module.exports = Results;
