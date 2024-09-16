import React, { useRef, useState } from 'react';
import '../styles/tour-details.css';
import { Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from 'react-router-dom';
import tourData from '../assets/data/tours';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import Booking from '../components/Booking/Booking';
import Newsletter from '../shared/Newsletter';

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const tour = tourData.find(tour => tour.id === id);

  if (!tour) {
    return <div>Loading...</div>;
  }

  const { photo, title, desc, price, reviews, address, city, distance, maxGroupSize } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  const submitHandler = e => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    alert(`${reviewText}, ${tourRating}`);
  };

  return (
    <>
      <section>
        <Row>
          <Col lg='8'>
            <div className='tour__content'>
              <img src={photo} alt='' />
              <div className='tour__info'>
                <h2>{title}</h2>
                <div className='d-flex align-items-center gap-5'>
                  <span className='d-flex align-items-center gap-1'>
                    <span className='tour__rating d-flex align-items-center gap-1'>
                      <i className="ri-star-fill" style={{ color: 'var(--secondary-color)' }}></i>
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? (
                        "Not rated"
                      ) : (
                        <span> ({reviews?.length})</span>
                      )}
                    </span>
                  </span>
                  <span>
                    <i className="ri-map-pin-user-fill"></i>
                    {address}
                  </span>
                </div>

                <div className='tour__extra-details'>
                  <span><i className="ri-map-pin-user-fill"></i> {city}</span>
                  <span><i className="ri-money-dollar-circle-line"></i> ${price}/per person</span>
                  <span><i className="ri-map-pin-time-line"></i> {distance} km</span>
                  <span><i className="ri-group-line"></i> {maxGroupSize} people</span>
                </div>

                <h5>Description</h5>
                <p>{desc}</p>
              </div>

              <div className='tour__reviews mt-4'>
                <h4>Reviews ({reviews?.length} reviews)</h4>
                <Form onSubmit={submitHandler}>
                  <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                    {[1, 2, 3, 4, 5].map(num => (
                      <span key={num} onClick={() => setTourRating(num)}>
                        {num}<i className="ri-star-s-fill"></i>
                      </span>
                    ))}
                  </div>

                  <div className='review__input'>
                    <input
                      type="text"
                      ref={reviewMsgRef}
                      placeholder='Share your thoughts'
                      required
                    />
                    <button className='btn primary__btn text-white'>Submit</button>
                  </div>
                </Form>
                <ListGroup className="user__reviews">
                  {reviews?.map(review => (
                    <div className="review__item" key={review.id}>
                      <img src={avatar} alt="" />
                      <div className='w-100'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div>
                            <h5>{review.name}</h5>
                            <p>{new Date(review.date).toLocaleDateString('en-US', options)}</p>
                          </div>
                          <span className='d-flex align-items-center'>
                            {review.rating}<i className="ri-star-s-fill"></i>
                          </span>
                        </div>
                        <h6>{review.comment}</h6>
                      </div>
                    </div>
                  ))}
                </ListGroup>
              </div>
            </div>
          </Col>
          <Col lg='4'>
            <Booking tour={tour} avgRating={avgRating} />
          </Col>
        </Row>
      </section>
      <Newsletter />
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

const TourDetailsWithErrorBoundary = () => (
  <ErrorBoundary>
    <TourDetails />
  </ErrorBoundary>
);

export default TourDetailsWithErrorBoundary;
