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
  const storedRecipe = localStorage.getItem('@ConvertMyRecipe:recipe') || '';

  const { addToast } = useToast();
  const history = useHistory();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(storedRecipe);

      addToast({
        type: 'success',
        title: 'Copy to clipboard',
        description: 'The recipe was copied to your clipboard',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Copy to clipboard',
        description: 'Could not copy the recipe to your clipboard',
      });
    }
  }, [addToast]);

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
          <div>{storedRecipe}</div>

          <h1>AD</h1>
          <ButtonContainer>
            <Button
              style={{ width: '20%', marginRight: '16px' }}
              onClick={handleCopy}
            >
              Copy
            </Button>
            <Button onClick={() => history.push('/')}>Start over</Button>
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
