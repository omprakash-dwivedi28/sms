import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import smsImage from "../../Image/sms.jpeg";
import smsImage1 from "../../Image/sms1.jpeg";
import smsImage2 from "../../Image/sms2.jpeg";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Ratio from "react-bootstrap/Ratio";

function Slider() {
  return (
    <Carousel data-bs-theme="dark">
      <Carousel.Item>
        <Row
          className="justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Ratio aspectRatio="16x9">
            <Col xs={8} md={5} className="d-flex justify-content-center">
              {/* <Col style={{ width: 660, height: "auto" }}> */}
              <Image
                src={smsImage}
                className="img-fluid"
                alt="Centered Image"
              />
            </Col>
          </Ratio>
        </Row>
        <Carousel.Caption>
          {/* <h5>sms</h5>
          <p>sms</p>
          <h5>First slide label</h5>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Row
          className="justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Ratio aspectRatio="16x9">
            <Col xs={8} md={5} className="d-flex justify-content-center">
              {/* <Col style={{ width: 660, height: "auto" }}> */}
              <Image
                src={smsImage1}
                className="img-fluid"
                alt="Centered Image"
              />
            </Col>
          </Ratio>
        </Row>
        <Carousel.Caption>
          {/* <h5>sms</h5>
          <p>sms</p> */}

          {/* <h5>Second slide label</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Row
          className="justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Ratio aspectRatio="16x9">
            <Col xs={8} md={5} className="d-flex justify-content-center">
              {/* <Col style={{ width: 660, height: "auto" }}> */}
              <Image
                src={smsImage2}
                className="img-fluid"
                alt="Centered Image"
              />
            </Col>
          </Ratio>
        </Row>
        <Carousel.Caption>
          {/* <h5>sms</h5>
          <p>sms</p>

          <h5>Third slide label</h5>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;
