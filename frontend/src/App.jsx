import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingSuccess from "./pages/BookingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route path="/booking-success" element={<BookingSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;