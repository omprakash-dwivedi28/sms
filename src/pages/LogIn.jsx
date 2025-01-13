import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaUserTie } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { MdNearbyError } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Registration from "./registration";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [eyeOpen, setEyeOpen] = useState(false);

  const [showRegistration, setShowRegistration] = useState(false);

  const navigate = useNavigate();
  const { updateUserData } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/user_login_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (data.success) {
        if (data.user && data.token) {
          updateUserData(data.user);
          console.log("updateUserData", data);
          localStorage.setItem("sessionToken", data.token);
          navigate("/");
        } else {
          setMsg("Login successful but token is missing");
        }
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMsg("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setShowRegistration((prev) => !prev);
  };
  return (
    <div className="">
      <div className="row d-flex justify-content-center ">
        <div className={`col-md-6 `}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">
                    <FaUserTie /> Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <RiLockPasswordFill /> Password
                  </label>
                  <div className="input-group">
                    <input
                      type={eyeOpen ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setEyeOpen(!eyeOpen)}
                    >
                      {eyeOpen ? <IoMdEye /> : <IoEyeOff />}
                    </Button>
                  </div>
                </div>

                {msg && (
                  <div className="text-danger mb-3">
                    <MdNearbyError /> {msg}
                  </div>
                )}

                <div className="d-grid">
                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>

        {showRegistration ? (
          <div className="col-md-6">
            <Registration />
          </div>
        ) : null}
      </div>

      <button className="btn btn-success" onClick={handleToggle}>
        {showRegistration ? "Close Sign Up" : "Sign UP"}
      </button>
    </div>
  );
};

export default Login;
