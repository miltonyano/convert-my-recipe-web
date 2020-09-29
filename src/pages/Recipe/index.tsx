import React, { useState, useCallback, useMemo, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { sanitize } from 'dompurify';

import parse, { domToReact } from 'html-react-parser';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import Button from '../../components/Button';

// import api from '../../services/api';
// import getValidationErrors from '../../utils/getValidationErrors';
// import { useToast } from '../../hooks/toast';

import {
  Container,
  Content,
  RecipeContainer,
  UnitSpan,
  ButtonContainer,
  SideAds,
} from './styles';
import RecipeConversionContainer from '../../components/RecipeConversionContainer';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

interface UnitFormData {
  [key: string]: string;
}

const Recipe: React.FC = () => {
  // const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const [disabled, setDisabled] = useState(true);

  const parsedRecipeSanitized = useMemo(() => {
    const parsedRecipe =
      localStorage.getItem('@ConvertMyRecipe:parsedRecipe') || '';

    return sanitize(parsedRecipe, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class', 'id'],
    });
  }, []);

  const handleEdit = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleSubmit = useCallback((data: UnitFormData) => {
    console.log(data);
  }, []);

  return (
    <Container>
      <Navbar expand="lg" bg="light">
        <Navbar.Brand>Convert my Recipe</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <NavDropdown title="Units" id="collasible-nav-dropdown">
              <NavDropdown.Item>Kilogrm</NavDropdown.Item>
              <NavDropdown.Item>Gram</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Litre</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

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
