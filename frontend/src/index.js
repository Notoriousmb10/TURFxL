import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for createRoot
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import store from "./redux/store/store.js";
import App from "./App";
import "./App.css";

// Access the Clerk Publishable Key from environment variables
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Log the publishable key to verify it's being accessed correctly
console.log("Clerk Publishable Key:", clerkPublishableKey);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ClerkProvider>
);