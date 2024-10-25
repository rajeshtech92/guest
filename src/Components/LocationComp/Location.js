import "./Location.css";
import React, { useState, useEffect } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { APIProvider } from "@vis.gl/react-google-maps";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import logo from '../ImageCom/logo.jpg'; // Make sure to replace this with the correct path to your logo image

const Location = () => {
  // Set marker location to Noida Sector 8
  const [markerLocation, setMarkerLocation] = useState({
    lat: 28.5873,
    lng: 77.3195,
  });
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // Mock fetch or some asynchronous operation
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader once the "data" is fetched
    }, 3000); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className="map-container">
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src={logo} alt="Logo" style={{ marginBottom: '10px', width: '110px', height: '120px' }} />
          <Box sx={{ width: '110px' }}>
            <LinearProgress color="success" style={{ height: '1px' }} />
          </Box>
        </div>
      ) : (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ borderRadius: "20px" }}
            defaultZoom={13}
            defaultCenter={markerLocation}
            gestureHandling={"greedy"}
            disableDefaultUI
          >
            <Marker position={markerLocation} />
          </Map>
        </APIProvider>
      )}
    </div>
  );
}

export default Location;
