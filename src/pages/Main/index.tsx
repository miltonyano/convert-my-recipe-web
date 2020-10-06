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

interface RecipeFormData {
  recipe: string;
}

interface UnitInText {
  value: number;
  unitText: string;
  term: string;
  id: string;
}

interface UnitFound {
  name: string;
  unitList: UnitInText[];
  conversion: string[];
}

interface ApiResponse {
  terms: string[];
  unitGroup: UnitFound[];
  parsedRecipe: string;
}

const Main: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const storedRecipe = localStorage.getItem('@ConvertMyRecipe:recipe') || '';

  const { addToast } = useToast();
  const history = useHistory();

  const [disabled, setDisabled] = useState(!storedRecipe);

  const handleTextareaChange = useCallback(() => {
    setDisabled(!formRef.current?.getFieldValue('recipe'));
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    formRef.current?.setFieldValue('recipe', text);
    setDisabled(!formRef.current?.getFieldValue('recipe'));
  }, []);

  const handleSubmit = useCallback(
    async (data: RecipeFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          recipe: Yup.string().required('Please insert your recipe.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { recipe } = data;

        const storedUnitGroup = localStorage.getItem(
          '@ConvertMyRecipe:unitGroup',
        );

        if (recipe !== storedRecipe || !storedUnitGroup) {
          localStorage.setItem('@ConvertMyRecipe:recipe', recipe);
          localStorage.removeItem('@ConvertMyRecipe:parsedRecipe');
          localStorage.removeItem('@ConvertMyRecipe:unitGroup');

          const response = await api.post<ApiResponse>('/recipe/parse', {
            recipe,
          });

          const { unitGroup, parsedRecipe } = response.data;

          if (!unitGroup.length) {
            addToast({
              type: 'info',
              title: 'No units found',
              description: 'No units where found in your recipe!',
            });

            return;
          }

          localStorage.setItem('@ConvertMyRecipe:parsedRecipe', parsedRecipe);
          localStorage.setItem(
            '@ConvertMyRecipe:unitGroup',
            JSON.stringify(unitGroup),
          );
        }

        history.push('/recipe');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Internal error',
          description: 'An error has occurred. Please try again later',
        });
      }
    },
    [addToast, history, storedRecipe],
  );

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
          <Form
            ref={formRef}
            initialData={{
              recipe: storedRecipe,
            }}
            onSubmit={handleSubmit}
          >
            <Textarea
              name="recipe"
              draggable="false"
              onChange={handleTextareaChange}
              placeholder="Type or paste your recipe here. Then click on start!"
            />

            <h1>AD</h1>
            <ButtonContainer>
              <Button
                style={{ width: '20%', marginRight: '16px' }}
                onClick={handlePaste}
              >
                Paste
              </Button>
              <Button type="submit" disabled={disabled}>
                Next
              </Button>
            </ButtonContainer>
          </Form>
        </RecipeContainer>

        <SideAds>
          <h1>Ad 1</h1>
          <h1>Ad 2</h1>
          <h1>Ad 3</h1>
        </SideAds>
      </Content>
      <div id="test">
        <h1>Test</h1>
      </div>
    </Container>
  );
};

export default Main;
