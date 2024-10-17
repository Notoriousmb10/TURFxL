import React from 'react';
import ServiceCard from './ServiceCard';
import { Col } from 'reactstrap';
import weatherImg from '../assets/images/weather.png';
import guideImg from '../assets/images/guide.png';
import customizationImg from '../assets/images/customization.png';

const servicesData = [
  {
    imgUrl: weatherImg,
    title: " Find the Best Turf",
    desc: "Easily find turfs in your preferred location"
  },
  {
    imgUrl: guideImg,
    title: "Reserve a Turf",
    desc: "Quickly book your turf with real-time availability"
  },
  {
    imgUrl: customizationImg,
    title: "Customize Your Booking",
    desc: "Personalize your turf booking based on your needs and preferences"
  }
];

const Services = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg='3' key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
}

export default Services;
