import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import MyList from './components/MyList.jsx';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './styles.css';
import './beerBackground.jpg';

//ReactDOM.render(<App />, document.getElementById('App'));

ReactDOM.render((
<Router>
  <div>
    <Route exact path='/' component={App} />
    <Route path='/MyList' component={MyList} test={10000}/>
  </div>
</Router>
), document.getElementById('App'))
