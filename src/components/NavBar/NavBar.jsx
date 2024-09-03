import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

function NavBar() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />

            <Navbar.Brand href="#">
              <strong>Welcome to staff management system!!!!!!!</strong>
            </Navbar.Brand>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start" // Change placement to start for left side
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Staff Mgmt
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-grow-1 pe-3">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/DepotMaster">Depot Master</Nav.Link>
                  <Nav.Link href="/EmpMaster">Employee Master</Nav.Link>

                  <Nav.Link href="/PostEmployeeModification ">
                    Employee Joining Formalities
                  </Nav.Link>
                  <Nav.Link href="/empAnalysis">
                    Employee Transfer Analysis{" "}
                  </Nav.Link>
                  <Nav.Link href="/EmpTransferHistori">
                    Employee Transfer History{" "}
                  </Nav.Link>
                  <Nav.Link href="/depotWiseAnalysis">
                    All Depot Analysis{" "}
                  </Nav.Link>
                  <Nav.Link href="/Transfer">Employee Transfer</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
            <Form className="d-flex ms-auto">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavBar;
