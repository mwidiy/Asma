import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;

const INITIAL_LOCATION = [-6.2088, 106.8456]; // Jakarta

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      position: [-6.2088, 106.8456],
      sender: 'Seseorang',
      text: 'Halo! Ini adalah pesan pertamamu di peta.',
      date: '2023-10-27'
    }
  ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Peta Pesan Rahasia</h1>
        <p>Temukan pesan-pesan tersembunyi di berbagai lokasi</p>
      </header>
      
      <main className="map-wrapper">
        <MapContainer 
          center={INITIAL_LOCATION} 
          zoom={13} 
          scrollWheelZoom={true}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {messages.map((msg) => (
            <Marker key={msg.id} position={msg.position}>
              <Popup className="custom-popup">
                <div className="message-card">
                  <h3>Pesan dari: {msg.sender}</h3>
                  <p className="message-text">"{msg.text}"</p>
                  <span className="message-date">{msg.date}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default App;
