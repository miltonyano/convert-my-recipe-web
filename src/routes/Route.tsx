import React from 'react';
import {
  Route as ReactDomRoute,
  RouteProps as ReactDomRouteProps,
  Redirect,
} from 'react-router-dom';

interface RouteProps extends ReactDomRouteProps {
  isRestrict?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isRestrict = false,
  component: Component,
  ...rest
}) => {
  const parsedRecipe = localStorage.getItem('@ConvertMyRecipe:parsedRecipe');

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) => {
        return isRestrict && !parsedRecipe ? (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        ) : (
          <Component />
        );
      }}
    />
  );
};

export default Route;
