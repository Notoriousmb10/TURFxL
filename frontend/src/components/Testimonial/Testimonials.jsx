import React from 'react';
import Slider from 'react-slick';
import ava01 from '../../assets/images/ava-1.jpg';
import ava02 from '../../assets/images/ava-2.jpg';
import ava03 from '../../assets/images/ava-3.jpg';

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      <div className='testimonial py-4 px-3'>
        <p>
          "The turf quality is excellent! We held a football tournament here, and the experience was fantastic. The maintenance and facilities are top-notch."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava01} className='w-25 h-25 rounded-2' alt='Customer 1' />
          <div>
            <h5 className='mb-0 mt-3'>John Doe</h5>
            <p className='mb-0'>Football Enthusiast</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          "I've been a regular here for cricket practice. The turf is always well-maintained, and booking is so convenient. A great place for team sports."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava02} className='w-25 h-25 rounded-2' alt='Customer 2' />
          <div>
            <h5 className='mb-0 mt-3'>Jane Smith</h5>
            <p className='mb-0'>Cricket Player</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          "We booked the turf for a corporate football event, and it was an absolute hit! The staff was very supportive, and the turf condition was perfect for the game."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava03} className='w-25 h-25 rounded-2' alt='Customer 3' />
          <div>
            <h5 className='mb-0 mt-3'>Emily Johnson</h5>
            <p className='mb-0'>Event Organizer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          "The turf provides an amazing environment for fitness training. It's spacious, well-maintained, and always available when needed."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava01} className='w-25 h-25 rounded-2' alt='Customer 4' />
          <div>
            <h5 className='mb-0 mt-3'>Michael Brown</h5>
            <p className='mb-0'>Fitness Coach</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          "I come here with friends for weekly football matches, and we love the atmosphere! The turf is always in great condition, and the booking process is seamless."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava02} className='w-25 h-25 rounded-2' alt='Customer 5' />
          <div>
            <h5 className='mb-0 mt-3'>Chris Green</h5>
            <p className='mb-0'>Regular Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          "The facilities here are world-class! We organized a charity event, and the turf quality and staff support exceeded our expectations."
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava03} className='w-25 h-25 rounded-2' alt='Customer 6' />
          <div>
            <h5 className='mb-0 mt-3'>Sara Williams</h5>
            <p className='mb-0'>Event Coordinator</p>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Testimonials;
