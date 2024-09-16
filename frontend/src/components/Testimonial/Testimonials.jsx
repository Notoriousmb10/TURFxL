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
          slidesToShow: 1,  // Adjusted to show 1 slide at a time on smaller screens
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
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava01} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Daniel Radcliffe </h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava02} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Emma Watson</h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava03} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Rupert Grint</h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava01} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Daniel Radcliffe </h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava02} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Emma Watson</h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>

      <div className='testimonial py-4 px-3'>
        <p>
          Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam, it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='d-flex align-items-center gap-4 mt-3'>
          <img src={ava03} className='w-25 h-25 rounded-2' alt='' />
          <div>
            <h5 className='mb-0 mt-3'>Rupert Grint</h5>
            <p className='mb-0'>Customer</p>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Testimonials;
