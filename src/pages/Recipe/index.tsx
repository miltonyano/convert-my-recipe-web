import React from 'react';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { Container, Content, SideAds } from './styles';
import RecipeConversionContainer from '../../components/RecipeConversionContainer';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const Recipe: React.FC = () => {
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
