import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Table, Alert, Card, Container, Row, Col } from "react-bootstrap";

function MutualTransferSearch() {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [userData, setUserData] = useState(null); // State for storing user-specific data

  useEffect(() => {
    if (user) {
      // Fetch data only if user exists
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://railwaymcq.com/sms/getMutualSearch.php?username=${user?.username}`
          );
          const data = await response.json();
          console.log("Fetched data:", data);

          // Set user-specific matches and mutual matches
          setUserData(data.user_matches); // Stores data for the logged-in user
          setMatches(data.mutual_matches); // Stores mutual transfer matches
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [user]);

  // If user is null, show an alert to prompt registration
  if (!user) {
    return (
      <Container>
        <Alert variant="warning" className="text-center my-4">
          Please register first to access this feature.
        </Alert>
      </Container>
    );
  }

  // If userData is null, show an alert and stop rendering further content
  if (userData === null) {
    return (
      <Container>
        <Alert variant="warning" className="text-center my-4">
          Please register first to access your profile information.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Header>
              <h1>Find Your Mutual Transfers</h1>
            </Card.Header>
            <Card.Body>
              <Card.Title>Welcome, {user?.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Username: {user?.username}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Your Profile</h4>
          {userData?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Post</th>
                  <th>Required zone</th>
                  <th>Required division</th>
                </tr>
              </thead>
              <tbody>
                {userData?.map((match) => (
                  <tr key={match.id}>
                    <td>{match.id}</td>
                    <td>{match.user}</td>
                    <td>{match.designation}</td>
                    <td>{match.muzone}</td>
                    <td>{match.mudivision}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              No profile-specific data found.
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Card.Text>
            <h4>
              Below are the mutual transfer exact matches found based on your
              profile.
            </h4>
          </Card.Text>
          {matches?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>User Name</th>
                  <th>POST</th>
                  <th>Zone</th>
                  <th>Division</th>
                  <th>Contact No</th>
                </tr>
              </thead>
              <tbody>
                {matches?.map((match) => (
                  <tr key={match.id}>
                    <td>{match.id}</td>
                    <td>{match.user}</td>
                    <td>{match.name}</td>
                    <td>{match.designation}</td>
                    <td>{match.zone}</td>
                    <td>{match.division}</td>
                    <td>{match.mobno}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              No matches found for your profile.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MutualTransferSearch;
