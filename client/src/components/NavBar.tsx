import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink, useLocation } from "react-router-dom"

function NavBar() {

  const location = useLocation()

  const isRecordsActive = [
    "/table/students",
    "/table/programs",
    "/table/colleges",
  ].includes(location.pathname)

  const isAcademicActive = [
    "/enrollment",
    "/establish/programs",
    "/establish/colleges",
  ].includes(location.pathname)
  
  return (
    <Navbar expand='lg' className='navbar-custom'>
      <Container className='navbar-container'>
        <Navbar.Brand id='navbar-brand'/>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mx-auto' id='navbar-links'>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile">
                profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title='records' id='basic-nav-dropdown' className={isRecordsActive ? "active-dropdown" : ""}>
                <div className='nav-dropdown'>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/table/students">
                    students
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/table/programs">
                    programs
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/table/colleges">
                    colleges
                  </Nav.Link>
                </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title='academic affairs' id='basic-nav-dropdown' className={isAcademicActive ? "active-dropdown" : ""}>
                <div className='nav-dropdown'>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/enrollment">
                    enrollment
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/establish/programs">
                    establish program
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={NavLink} to="/establish/colleges">
                    establish college
                  </Nav.Link>
                </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar