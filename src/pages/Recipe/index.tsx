import React from 'react';

import Header from '../../components/Header';
import RecipeConversionContainer from '../../components/RecipeConversionContainer';

import { Container, Content } from './styles';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const Recipe: React.FC = () => {
  return (
    <Container>
      <Header />

      <Content>
        <RecipeConversionContainer />
      </Content>
    </Container>
  );
};

export default Recipe;
