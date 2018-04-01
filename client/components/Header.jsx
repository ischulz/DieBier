import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test2: 0,
    };
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <LinkContainer to="/">
            <Navbar.Brand>DieBier</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/MyList">
              <NavItem eventKey={1}>MyList</NavItem>
            </LinkContainer>
            <NavItem eventKey={2} href="#">
              HaveHad
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">
              Log Out
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;