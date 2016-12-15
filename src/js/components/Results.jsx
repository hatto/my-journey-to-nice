import React        from 'react';
import classNames   from 'classnames';
import ResultsStore from '../stores/ResultsStore';
import moment       from 'moment';

import ResultsTotal from './ResultsTotal.jsx';
import Map          from './Map.jsx';


function getStateFromStores() {
    return ResultsStore.getResultsTotalState();
}

var Results = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
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
                <ResultsTotal startDate={ this.state.dates.min.format("YYYY-MM-DD") } endDate={ this.state.dates.max.format("YYYY-MM-DD") } profile={ true } type={ "all" } />
                { map }
                <ResultsTotal startDate={ this.state.dates.currentMin.format("YYYY-MM-DD") } endDate={ this.state.dates.currentMax.format("YYYY-MM-DD") } profile={ true } type={ "week" } />
            </div>
        );
    }
});

module.exports = Results;
