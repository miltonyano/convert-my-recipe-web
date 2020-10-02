import React from 'react';

import Header from '../../components/Header';
import RecipeConversionContainer from '../../components/RecipeConversionContainer';

import { Container, Content, SideAds } from './styles';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const Recipe: React.FC = () => {
  return (
    <Container>
      <Header />

      <Content>
        <RecipeConversionContainer />

        <SideAds>
          <h1>Ad 1</h1>
          <h1>Ad 2</h1>
          <h1>Ad 3</h1>
        </SideAds>
      </Content>
    </Container>
  );
};

export default Recipe;
