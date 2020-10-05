import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Button from '../../components/Button';

import {
  Container,
  Content,
  RecipeContainer,
  ConvertedRecipeContainer,
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
  }, [addToast, storedRecipe]);

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
          <ConvertedRecipeContainer>
            <div>{storedRecipe}</div>
          </ConvertedRecipeContainer>

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
