import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const api_endpoint = `http://api.openweathermap.org/geo/1.0/reverse?`;

const App = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);
  const [localName, setLocalName] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    axios
      .get(`${api_endpoint}lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`)
      .then((res) => {
        console.log(res.data);

        setCity(res.data[0].name);
        setLocalName(res.data[0].local_names.hi);
        setState(res.data[0].state);
        setCountry(res.data[0].country);
      });
  }, [lat, lng]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("⚠️Unable to retrieve your location");
        }
      );
    }
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          getLocation();
        }}
      >
        Get Location
      </button>

      <p>{status ? status : "✔️Location Accessible"}</p>
      {lat && lng && (
        <div>
          <h2>Coordinates</h2>

          {lat && <p>Latitude: {lat}</p>}
          {lng && <p>Longitude: {lng}</p>}
        </div>
      )}

      {(city || localName || state || country) && (
        <p>
          {
            <div>
              <h2>Location</h2>
              <p>
                {city} ({localName}), {state}, {country}
              </p>
            </div>
          }
        </p>
      )}
    </div>
  );
};

export default App;
