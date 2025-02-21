export const setLocation = (latitude, longitude) => ({
  type: "SET_LOCATION",
  payload: { latitude, longitude },
});

export const fetchLocation = () => (dispatch) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Fetched location:", position.coords.latitude, position.coords.longitude); // Debugging log
      dispatch(setLocation(position.coords.latitude, position.coords.longitude));
    },
    (error) => console.error("Error getting location:", error)
  );
};
