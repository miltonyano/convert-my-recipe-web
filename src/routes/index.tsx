import React from 'react';

import { Switch } from 'react-router-dom';

import Route from './Route';

import Main from '../pages/Main';
import Recipe from '../pages/Recipe';
import ConvertedRecipe from '../pages/ConvertedRecipe';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Main} />
    <Route path="/recipe" exact component={Recipe} isRestrict />
    <Route path="/recipe/converted" component={ConvertedRecipe} />
  </Switch>
);

export default Routes;
