import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Calculator from './pages/Calculator';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/calculator' component={Calculator} />
      </Switch>
    </Router>
  );
};

export default App;