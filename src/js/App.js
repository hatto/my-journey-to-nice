import React        from 'react';
import ReactDOM     from 'react-dom';
import vars         from 'vars';
import ReactGA      from 'react-ga';


import Timer        from './components/Timer.jsx';
import Results      from './components/Results.jsx';
import Profile      from './components/Profile.jsx';
import Instagram    from './components/Instagram.jsx';
import Day          from './components/Day.jsx';
import Footer       from './components/Footer.jsx';

ReactGA.initialize(vars.ga);
ReactGA.pageview('/');

ReactDOM.render(
    <div>
        <Timer />
        <Day />
        <Results />
        <Instagram />
        <Footer />
    </div>,
  document.getElementById('app')
);
