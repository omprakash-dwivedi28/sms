import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
// import smsImage from "./sms.jpeg";

function Home() {
  return (
    <div>
      <Container>
        <Row>
          <Col xs={6} md={4}>
            {/* <Image src={smsImage} className="img-fluid" alt="SMS" />{" "} */}
            {/* Use the imported image */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
