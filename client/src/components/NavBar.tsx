import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../style/App.css'

function NavBar() {
  return (
    <Navbar expand='lg' className='navbar-custom'>
      <Container className='navbar-container'>
        <Navbar.Brand href='#home' id='navbar-brand'>mySSIS</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mx-auto'>
            <Nav.Item>
              <Nav.Link href='#home'>home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title='tables' id='basic-nav-dropdown'>
                <NavDropdown.Item href='#students'>students</NavDropdown.Item>
                <NavDropdown.Item href='#programs'>programs</NavDropdown.Item>
                <NavDropdown.Item href='#colleges'>colleges</NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#profile'>profile</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar