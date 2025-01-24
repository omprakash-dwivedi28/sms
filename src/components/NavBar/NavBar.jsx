import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import Anni from "./Anni";
import "../css/NavBar.css";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

function NavBar() {
  const { logoutUser, user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLoginClick = () => {
    navigate("/LogIn");
  };

  const handleLogoutClick = () => {
    logoutUser();
    localStorage.removeItem("sessionToken"); // Clear token on logout
    navigate("/LogIn"); // Redirect to login page
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link onClick={() => navigate("/")}>
                <FaHome style={{ color: "blue" }} />
              </Nav.Link>
              {user && (
                <>
                  {/* Conditional Rendering based on login_type */}
                  {user.login_type === "admin" ? (
                    <>
                      <NavDropdown
                        title="Master Pages"
                        id="master-pages-dropdown"
                      >
                        <NavDropdown.Item
                          onClick={() => navigate("/DepotMaster")}
                        >
                          Depot Master
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/EmpMaster")}
                        >
                          Employee Master
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/BulkUpdatEmp")}
                        >
                          Bulk update Employee Depot Wise
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/EditableEmpMaster")}
                        >
                          Editable Employee Master
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/SkillMaster")}
                        >
                          Skill Master
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/EducationMaster")}
                        >
                          Education Master
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Operational Pages"
                        id="operational-pages-dropdown"
                      >
                        <NavDropdown.Item onClick={() => navigate("/Transfer")}>
                          Employee Transfer
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/SearchStaffPosition")}
                        >
                          Search New Staff Position
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/PostEmployeeModification")}
                        >
                          Employee Joining Formalities
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Analysis & Report"
                        id="analysis-report-dropdown"
                      >
                        <NavDropdown.Item
                          onClick={() => navigate("/empAnalysis")}
                        >
                          Employee Transfer Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/EmpTransferHistori")}
                        >
                          Employee Transfer History
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/depotWiseAnalysis")}
                        >
                          All Depot Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/DepotWiseEmpSkillData")}
                        >
                          Depot Wise Employee & Skill Data
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        title="Visual Analytics Pages"
                        id="visual-analytics-dropdown"
                      >
                        <NavDropdown.Item
                          onClick={() => navigate("/Analytics")}
                        >
                          Depot wise Analytics
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => navigate("/EmpAnalytics")}
                        >
                          Employee wise Analytics
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : null}

                  {/* Common Pages for all users */}
                  <NavDropdown
                    title="Mutual Transfer Pages"
                    id="mutual-transfer-dropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => navigate("/MutualsearchRegistration")}
                    >
                      Mutual Transfer Search Registration
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navigate("/MutualTransferSearch")}
                    >
                      Mutual Transfer Search
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title="On Request Pages"
                    id="on-request-dropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => navigate("/OnrequestRegistration")}
                    >
                      OnRequest Registration
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <Form className="d-flex ms-auto align-items-center">
          <FaUser style={{ color: "blue", marginRight: "8px" }} />{" "}
          {/* Adds margin to the right of the icon */}
          <span className="me-2">{user ? user.name : "GUEST"}</span>{" "}
          {/* Adds margin to the right of the user name */}
          {user ? (
            <Button variant="outline-danger" onClick={handleLogoutClick}>
              Logout
            </Button>
          ) : (
            <Button variant="outline-primary" onClick={handleLoginClick}>
              Login
            </Button>
          )}
        </Form>

        <Anni />
      </Container>
    </Navbar>
  );
}

export default NavBar;
