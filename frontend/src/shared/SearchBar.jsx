import React, { useRef, useState } from "react";
import "../shared/search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "./../utils/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchTurf } from "../redux/actions/userActions";

const SearchBar = () => {
  const locationRef = useRef();
  const distanceRef = useRef();
  const maxGroupSizeRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const searchHandler = async () => {
    dispatch(
      searchTurf({
        location: locationRef.current.value,
        distance: distanceRef.current.value,
        maxGroupSize: maxGroupSizeRef.current.value,
      })
    );

    const location = locationRef.current.value;
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (location === "" || distance === "" || maxGroupSize === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`
      );
      if (!res.ok) {
        console.error("Something went wrong");
        return;
      }

      const result = await res.json();
      // Pass the result to the state or context where you handle tour cards
      // Example:
      navigate(
        `/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
        { state: { tours: result.data } }
      );
    } catch (error) {
      console.error("Error fetching tour data:", error);
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form
          className="d-flex align-items-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup className="d-flex flex-column align-items-start gap-2 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-line"></i>
            </span>
            <h6>Location</h6>
            <input
              type="text"
              placeholder="Turf Locality ?"
              ref={locationRef}
            />
          </FormGroup>

          <FormGroup className="d-flex flex-column align-items-start gap-2 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-time-line"></i>
            </span>
            <h6>Distance</h6>
            <input
              type="number"
              placeholder="Distance k/m"
              ref={distanceRef}
              min={0}
            />
          </FormGroup>

          <FormGroup className="d-flex flex-column align-items-start gap-2 form__group form__group-fast">
            <span>
              <i className="ri-group-line"></i>
            </span>
            <h6>Max People</h6>
            <input
              type="number"
              placeholder="0"
              ref={maxGroupSizeRef}
              min={0}
            />
          </FormGroup>

          <button
            className="search__icon"
            type="button"
            onClick={searchHandler}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <i className="ri-search-line"></i>
            )}
          </button>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
