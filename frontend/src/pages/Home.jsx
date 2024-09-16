import React from 'react';
import '../styles/home.css';
import { Container, Row, Col } from 'reactstrap';
import heroImg from '../assets/images/hero-img01.jpg';
import heroImg02 from '../assets/images/hero-img02.jpg';
import heroVideo from '../assets/images/hero-video.mp4';
import Subtitle from './../shared/Subtitle';
import worldImg from '../assets/images/world.png';
import SearchBar from '../shared/SearchBar';
import ServiceList from '../services/ServiceList';
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList';
import experienceImg from '../assets/images/experience.png'
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery';
import Testimonials from '../components/Testimonial/Testimonials'
import Newsletter from '../shared/Newsletter';
const Home = () => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='6'>
              <div className='hero__content'>
                <div className='hero__subtitle d-flex align-items-center'>
                  <Subtitle subtitle={'Know Before You Go'} />
                  <img src={worldImg} alt="World" />
                </div>
                <h1>
                  Travelling opens the door to creating{' '}
                  <span className='highlight'>memories</span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </Col>
            <Col lg='2'>
            <div className='hero__img-box'>
              <img src={heroImg} alt=""/>
            </div>
            </Col>
            <Col lg='2'>
            <div className='hero__img-box mt-4'>
              <video src={heroVideo} alt="" controls/>
            </div>
            </Col>
            <Col lg='2'>
            <div className='hero__img-box mt-5'>
              <img src={heroImg02} alt=""/>
            </div>


            </Col>
            <SearchBar/>

          </Row>
        </Container>
      </section> 
      {/* hero section */}

      <section>
        <Container>
        <Row>
          <Col lg='3'>
          <h5 className='services__subtitle'> What we serve</h5>
          <h2 className='services__title'>We offer our best services</h2>

          </Col>

           <ServiceList />
        </Row>

        </Container>
      </section>
{/* 
   featured tour section */}
   <section>
    <Container>
      <Row>
        <Col lg='12' className='mb-5'>
          <Subtitle subtitle={'Explore'}/>
          <h2 className='featured__tour-title'>Our featured Tours</h2>
        </Col>
        <FeaturedTourList/>
      </Row>
    </Container>
   </section>

   {/* experience section */}

   <section>
   <Container>

    <Row>
    <Col lg='6'>
  <div className='experience_content'>
  <Subtitle subtitle = {'Experience'}/>
  <h2>With our all  <br/> we will serve you</h2>
  <p>lorem ipsum dolor sit amet, consectetur elit.<br/>Quas aliquam, hic tempora inventore suspict unde</p>

  </div>
   <div className='counter__wrapper d-flex align-items-center gap-5'>
   <div className='counter__box'>
   <span>12k+</span>
   <h6>Successful Trip</h6>

   </div>
   <div className='counter__box'>
   <span>2k+</span>
   <h6>Regular Clients</h6>

   </div>
   <div className='counter__box'>
   <span>15</span>
   <h6>Years experience</h6>

   </div>

   </div>

    </Col>
    <Col lg='6'>
    <div className='experience__img'>
    <img src={experienceImg} alt=""/>

    </div>

    </Col>

    </Row>
   </Container>


   </section>

   {/* gallery section */}
   <section>
    <Container>
      <Row>
        <Col lg='12'>
          <Subtitle subtitle={'Gallery'}/>
          <h2 className='gallery__title'>Visit our customers tour gallery</h2>
        </Col>
        <Col lg='12'>
          <MasonryImagesGallery />
        </Col>
        {/* <Gallery /> */}
      </Row>
    </Container>
 

   </section>

   {/* testimonial */}

   <section>
    <Container>

      <Row>
        <Col lg='12'>

        <Subtitle subtitle={'Fans Love'}/>
        <h2 className='testimonial__title'>What our satisfied customers say</h2>
        </Col>
       <Testimonials />

      </Row>
    </Container>
   </section>

   <Newsletter/>




    </>
  );
};

export default Home;
