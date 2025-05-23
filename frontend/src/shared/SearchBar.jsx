import React, { useRef, useState } from "react";
import "../shared/search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { useDispatch } from "react-redux";
import { searchTurf } from "../redux/actions/userActions";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

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
  
    try {
      // Dispatch the action and wait for it to complete
      await dispatch(
        searchTurf({
          location,
        })
      );
  
      // Navigate after the action is complete
      navigate(`/searchresults?location=${location.toLowerCase()}`);
    } catch (error) {
      console.error("Error searching turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToPool = async () => {
    navigate("/player-matching-pool");


  }

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form
          className="d-flex align-items-left justify-content-left gap-4"
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
        <div>
          <p>Proximity Search</p>
          <button className="proxsearchbtn" onClick={redirectToPool}>Looking For Players?</button>
        </div>
        
      </div>
    </Col>
  );
};

export default SearchBar;
