import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import smsImage from "../Image/sms.jpeg";

function Home() {
  return (
    <div>
      <Container>
        <Row
          className="justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Col xs={8} md={5} className="d-flex justify-content-center">
            <Image src={smsImage} className="img-fluid" alt="Centered Image" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
