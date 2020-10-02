import React from 'react';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Header: React.FC = () => (
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
);

export default Header;
