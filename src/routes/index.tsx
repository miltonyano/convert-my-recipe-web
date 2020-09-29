import React from 'react';

import { Switch } from 'react-router-dom';

import Route from './Route';

import Main from '../pages/Main';
import Recipe from '../pages/Recipe';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Main} />
    <Route path="/recipe" component={Recipe} isRestrict />
  </Switch>
);

export default Routes;
