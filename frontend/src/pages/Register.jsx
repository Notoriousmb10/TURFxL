import React, { useState } from "react";
import { Container, Row, Col, FormGroup, Button, Form } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { auth } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { loginStatus, setUserInfo } from "../redux/actions/userActions";

const Register = () => {
  const [credentials, setCredentials] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    // Use credentials or handle them appropriately
    console.log(credentials); // Example of using the state to avoid the warning
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
      dispatch(
        setUserInfo({
          username: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );
      localStorage.setItem("isLoggedIn", true);
      dispatch(loginStatus(true));
      navigate("/");
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
    }
  };
  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Register</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="userName"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    onClick={handleClick}
                  >
                    Create Account
                  </Button>
                  <Button
                    className="btn primary__btn auth__btn"
                    onClick={handleGoogleSignIn}
                  >
                    Sign In With Google
                  </Button>
                </Form>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
