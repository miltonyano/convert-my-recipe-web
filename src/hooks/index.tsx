import React from 'react';

import { ToastProvider } from './toast';
import { RecipeProvider } from './recipe';

const AppProvider: React.FC = ({ children }) => (
  <RecipeProvider>
    <ToastProvider>{children}</ToastProvider>
  </RecipeProvider>
);

export default AppProvider;
