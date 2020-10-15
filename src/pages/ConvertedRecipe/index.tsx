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
        <RecipeContainer className="col-sm-9 col-md-8 col-lg-6">
          <ConvertedRecipeContainer>
            <div>{storedRecipe}</div>
          </ConvertedRecipeContainer>

          <ButtonContainer>
            <Button className="d-none d-sm-block col-sm-2" onClick={handleCopy}>
              Copy
            </Button>
            <Button className="col-sm-9" onClick={() => history.push('/')}>
              Restart
            </Button>
          </ButtonContainer>
        </RecipeContainer>
      </Content>
    </Container>
  );
};

export default ConvertedRecipe;
