import React from "react";
import "./newsletter.css";
import { Container, Row, Col } from "reactstrap";
import turfPlayer from "../assets/images/male-tourist.png";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subscribe now to get useful TurfXL update and information</h2>
              <div className="newsletter__input">
                <input type="email" placeholder="Enter your email" />
                <button className="btn newsletter__btn">Subscribe</button>
              </div>
              <p>
                Subscribe to our newsletter to receive exclusive updates,
                special offers, and the latest news about football turf
                bookings. Never miss out on exciting promotions and events
                happening at our turf! Sign up now and be the first to know!{" "}
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__img">
              <img src={turfPlayer} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
