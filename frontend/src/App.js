import "./App.css";
import Layout from "./components/Layout/Layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { fetchLocation } from "./redux/actions/locationAction";

function App() {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector((state) => state.location);

  useEffect(() => {
    dispatch(fetchLocation()); 
  }, [dispatch]);

  useEffect(() => {
    console.log("Updated state:", latitude, longitude); // Debugging log
    latitude && longitude && console.log(latitude, longitude);
  }, [latitude, longitude]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Layout />
      </div>
    </div>
  );
}

export default App;