import React from 'react';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Header: React.FC = () => (
  <Navbar expand="lg" bg="light">
    <Navbar.Brand href="/">Convert my Recipe</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav>
        <NavDropdown title="Mass" id="mass-nav-dropdown">
          <NavDropdown.Item href="/#kilogram">Kilogram</NavDropdown.Item>
          <NavDropdown.Item href="/#gram">Gram</NavDropdown.Item>
          <NavDropdown.Item href="/#milligram">Milligram</NavDropdown.Item>
          <NavDropdown.Item href="/#poundmass">Poundmass</NavDropdown.Item>
          <NavDropdown.Item href="/#ounce">Ounce</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/#mass-conversion-table">
            Conversion Table
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Volume" id="volume-nav-dropdown">
          <NavDropdown.Item href="/#liter">Liter</NavDropdown.Item>
          <NavDropdown.Item href="/#milliliter">Milliliter</NavDropdown.Item>
          <NavDropdown.Item href="/#fluidounce">Fluidounce</NavDropdown.Item>
          <NavDropdown.Item href="/#teaspoon">Teaspoon</NavDropdown.Item>
          <NavDropdown.Item href="/#tablespoon">Tablespoon</NavDropdown.Item>
          <NavDropdown.Item href="/#cup">Cup</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/#volume-conversion-table">
            Conversion Table
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Length" id="length-nav-dropdown">
          <NavDropdown.Item href="/#meter">Meter</NavDropdown.Item>
          <NavDropdown.Item href="/#centimeter">Centimeter</NavDropdown.Item>
          <NavDropdown.Item href="/#inch">Inch</NavDropdown.Item>
          <NavDropdown.Item href="/#Foot">Foot</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/#length-conversion-table">
            Conversion Table
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Temperature" id="temperature-nav-dropdown">
          <NavDropdown.Item href="/#celsius">Celsius</NavDropdown.Item>
          <NavDropdown.Item href="/#fahrenheit">Fahrenheit</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/#temperature-conversion-table">
            Conversion Table
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
