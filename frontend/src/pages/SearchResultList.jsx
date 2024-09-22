import React, { useState } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import TourCard from '../shared/TourCard';
import '../shared/TurfDisplay.css'

const SearchResultList = () => {
  const location = useLocation();
  const [data] = useState(location.state);
  console.log(data);

  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Container>
          <Row>
            {data && data.length > 0 ? (
              data.map((tour, index) => (
                <Col lg="3" md="4" sm="6" xs="12" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            ) : (
              <Col>
                <h4>No tours found.</h4>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default SearchResultList;
