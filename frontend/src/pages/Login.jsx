import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { SignIn } from "@clerk/clerk-react";
import '../styles/login.css';

import loginImg from '../assets/images/login.png';
import userIcon from '../assets/images/user.png';

const Login = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  );
};

export default Login;