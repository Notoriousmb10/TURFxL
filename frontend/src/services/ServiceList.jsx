import React from 'react';
import ServiceCard from './ServiceCard';
import { Col } from 'reactstrap';
import weatherImg from '../assets/images/weather.png';
import guideImg from '../assets/images/guide.png';
import customizationImg from '../assets/images/customization.png';

const servicesData = [
  {
    imgUrl: weatherImg,
    title: "Calculate Weather",
    desc: "Calculate the weather for any location"
  },
  {
    imgUrl: guideImg,
    title: "Book a Tour Guide",
    desc: "Find a guide who speaks your language"
  },
  {
    imgUrl: customizationImg,
    title: "Customize Your Tour",
    desc: "Tailor your tour to your preferences"
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
