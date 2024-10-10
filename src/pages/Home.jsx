import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import smsImage from "../Image/sms.jpeg";
import Ratio from "react-bootstrap/Ratio";
import Slider from "../components/NavBar/Slider";

function Home() {
  return (
    <div>
      <Container>
        <Slider />
      </Container>
    </div>
  );
}

export default Home;
