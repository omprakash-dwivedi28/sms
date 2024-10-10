import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { FaUserPlus } from "react-icons/fa6";
import { MdOutlineEditNote } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { VscMortarBoard } from "react-icons/vsc";
import { MdTransferWithinAStation } from "react-icons/md";
import { VscSignIn } from "react-icons/vsc";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import "../css/NavBar.css"; // Assuming you create a CSS file for custom styles
import "animate.css";

function NavBar() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="bg-body-tertiary d-lg mb-3"
        >
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />

            <Navbar.Brand href="#" className="move-left-to-right">
              <strong>Welcome to staff management system!!!!!!!</strong>
            </Navbar.Brand>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Staff Mgmt
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-grow-1 pe-3">
                  <Nav.Link href="/">
                    <FaHome style={{ color: "blue" }} />
                    Home
                  </Nav.Link>
                  <NavDropdown
                    title="Master Pages"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="/DepotMaster">
                      <SiHomeassistantcommunitystore
                        style={{ color: "blue" }}
                      />{" "}
                      Depot Master
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/EmpMaster">
                      <FaUserPlus style={{ color: "blue" }} /> Employee Master
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/EditableEmpMaster">
                      <MdOutlineEditNote style={{ color: "blue" }} />
                      Editabel Employee Master
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/SkillMaster">
                      <GiSkills style={{ color: "blue" }} /> Skill Master
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/EducationMaster">
                      <VscMortarBoard style={{ color: "blue" }} />
                      Education Master
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    title="Operational Pages"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="/Transfer">
                      <MdTransferWithinAStation style={{ color: "blue" }} />
                      Employee Transfer
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/PostEmployeeModification">
                      <VscSignIn style={{ color: "blue" }} />
                      Employee Joining Formalities
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title="Analysis & Report"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="/empAnalysis">
                      <AiOutlineConsoleSql style={{ color: "blue" }} />
                      Employee Transfer Analysis{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/EmpTransferHistori">
                      <AiOutlineConsoleSql style={{ color: "blue" }} />
                      Employee Transfer History{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/depotWiseAnalysis">
                      <AiOutlineConsoleSql style={{ color: "blue" }} />
                      All Depot Analysis{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/DepotWiseEmpSkillData">
                      <AiOutlineConsoleSql style={{ color: "blue" }} />
                      Depot Wise Employee & Skill Data{" "}
                    </NavDropdown.Item>
                  </NavDropdown>
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
