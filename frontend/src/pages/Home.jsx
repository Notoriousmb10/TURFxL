import React, { useEffect } from "react";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img01.avif";
import heroImg02 from "../assets/images/hero-img02.jpeg";
import heroVideo from "../assets/images/hero-video.mp4";
import Subtitle from "./../shared/Subtitle";
import worldImg from "../assets/images/world.png";
import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from "../components/Featured-tours/FeaturedTourList";
import experienceImg from "../assets/images/experience.jpeg";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";
import { motion } from "framer-motion";
import Footer from "../components/Footer/Footer";

const Home = () => {
  useEffect(() => {
    // Create script elements
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2024/10/19/15/20241019152253-GBYQU1NM.js";
    script2.async = true;

    // Append scripts to the document body
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // Cleanup function to remove scripts when the component unmounts
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <>
      <div>
        <div className="homebg">
          <section>
            <Container>
              <Row>
                <Col lg="6">
                  <motion.div
                    className="hero__content"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <div className="hero__subtitle d-flex align-items-center">
                      <Subtitle subtitle={"Know Your Place Before You Play"} />
                      <img src={worldImg} alt="World" />
                    </div>
                    <h1>
                      Play For Better <span className="highlight">Tomorrow</span>
                    </h1>
                    <p>
                      Find and book the best sports turfs near you! Browse
                      available turfs, check real-time availability, and make
                      easy reservations. Whether you're looking for football,
                      cricket, or any other turf, our platform helps you
                      quickly locate and book the perfect spot.
                    </p>
                  </motion.div>
                </Col>

                <Col lg="2">
                  <div className="hero__img-box">
                    <img src={heroImg} alt="" />
                  </div>
                </Col>
                <Col lg="2">
                  <div className="hero__img-box mt-4">
                    <video src={heroVideo} alt="Video" loop autoPlay muted />
                  </div>
                </Col>
                <Col lg="2">
                  <div className="hero__img-box mt-5">
                    <img src={heroImg02} alt="" />
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
          {/* hero section */}

          <motion.section
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Container>
              <Row>
                <Col lg="3">
                  <h5 className="services__subtitle"> What we serve</h5>
                  <h2 className="services__title">
                    We provide top-notch turf booking services
                  </h2>
                </Col>

                <ServiceList />
              </Row>
            </Container>
          </motion.section>

          {/* featured tour section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Container>
              <Row>
                <Col lg="12" className="mb-5">
                  <Subtitle subtitle={"Explore"} />
                  <h2 className="featured__tour-title">Our featured Turfs</h2>
                </Col>
                <FeaturedTourList />
              </Row>
            </Container>
          </motion.section>

          {/* experience section */}
          <section>
            <Container>
              <Row>
                <Col lg="6">
                  <div className="experience_content">
                    <Subtitle subtitle={"Experience"} />
                    <h2>
                      With our all <br /> We are dedicated to serving you
                    </h2>
                    <p>
                      Offering top-quality service for turf bookings, ensuring
                      a seamless experience.
                      <br />
                      Experience convenience and excellence with every
                      booking.
                    </p>
                  </div>
                  <div className="counter__wrapper d-flex align-items-center gap-5">
                    <div className="counter__box">
                      <span>500+</span>
                      <h6>Successful Bookings</h6>
                    </div>
                    <div className="counter__box">
                      <span>200+</span>
                      <h6>Regular Users</h6>
                    </div>
                    <div className="counter__box">
                      <span>5</span>
                      <h6>Years experience</h6>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="experience__img">
                    <img src={experienceImg} alt="" />
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          {/* gallery section */}
          <section>
            <Container>
              <Row>
                <Col lg="12">
                  <Subtitle subtitle={"Gallery"} />
                  <h2 className="gallery__title">Browse Turf Snapshots</h2>
                </Col>
                <Col lg="12">
                  <MasonryImagesGallery />
                </Col>
              </Row>
            </Container>
          </section>

          {/* testimonial section */}
          <section>
            <Container>
              <Row>
                <Col lg="12">
                  <Subtitle subtitle={"Fans Love"} />
                  <h2 className="testimonial__title">
                    What our satisfied customers say
                  </h2>
                </Col>
                <Testimonials />
              </Row>
            </Container>
          </section>

          <Newsletter />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
