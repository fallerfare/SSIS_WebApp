import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../style/App.css'
import { Link } from "react-router-dom"

function NavBar() {
  return (
    <Navbar expand='lg' className='navbar-custom'>
      <Container className='navbar-container'>
        <Navbar.Brand href='#home' id='navbar-brand'/>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mx-auto' id='navbar-links'>
            <Nav.Item>
              <Nav.Link href='#home'>home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#profile'>profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title='tables' id='basic-nav-dropdown'>
                <div className='nav-dropdown'>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to="/table/students">
                    students
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to="/table/programs">
                    programs
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to="/table/colleges">
                    colleges
                  </Nav.Link>
                </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#enrollment'>enrollment</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#establish'>establish</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar