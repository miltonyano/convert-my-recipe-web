import React, { useState, useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';

import {
  Container,
  Content,
  RecipeContainer,
  ButtonContainer,
  SideAds,
} from './styles';

const ConvertedRecipe: React.FC = () => {
  const storedRecipe = localStorage.getItem('@ConvertMyRecipe:recipe');

  const { addToast } = useToast();
  const history = useHistory();

  const handleCopy = useCallback(async () => {
    console.log('copy');
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <SideAds>
          <h1>Ad 1</h1>
          <h1>Ad 2</h1>
          <h1>Ad 3</h1>
        </SideAds>

        <RecipeContainer>
          <h1>RECIPE</h1>

          <h1>AD</h1>
          <ButtonContainer>
            <Button
              style={{ width: '20%', marginRight: '16px' }}
              onClick={handleCopy}
            >
              Copy
            </Button>
            <Button>Start new</Button>
          </ButtonContainer>
        </RecipeContainer>

        <SideAds>
          <h1>Ad 1</h1>
          <h1>Ad 2</h1>
          <h1>Ad 3</h1>
        </SideAds>
      </Content>
    </Container>
  );
};

export default ConvertedRecipe;
