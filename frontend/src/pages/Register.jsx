import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useUser, SignIn } from "@clerk/clerk-react";
// import { Container, Row, Col } from "reactstrap";
// import { SignIn } from "@clerk/clerk-react";
const Register = () => {
  const { signIn } = useSignIn();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("Google Sign-In Successful:", user);
      // Store user information in local storage or Redux store
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          photo: user.profileImageUrl,
        })
      );
      localStorage.setItem("isLoggedIn", true);
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      });
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <SignIn />
    </div>
  );
};

export default Register;
