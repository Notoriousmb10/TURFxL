import React, { useRef, useState } from "react";
import "../shared/search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "./../utils/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchTurf } from "../redux/actions/userActions";
import { ClipLoader } from "react-spinners";

import firebase from "firebase/compat/app";
const   SearchBar = ({ onSearch }) => {
  const locationRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const searchHandler = async () => {
    const location = locationRef.current.value;
    if (location === "") {
      alert("Please fill field");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        dispatch(
          searchTurf({
            location,
          })
        );
        setLoading(false);

        navigate(`/searchresults?location=${location.toLowerCase()}`);
      } catch (error) {
        console.error("Error searching turfs:", error);
        setLoading(false);
      }
    }, 4000);
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form
          className="d-flex align-items-center justify-content-center gap-4"
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
          <button
            className="search__icon"
            type="button"
            onClick={searchHandler}
            disabled={loading}
          >
            {loading ? (
             <div className="spinner-container">
             <ClipLoader color="#000" loading={loading} size={50} />
           </div>
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
