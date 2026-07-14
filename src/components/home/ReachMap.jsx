import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const JACZKOWICE = { lat: 50.8767, lng: 16.5439 };
const RADIUS_KM = 50;

// Fix default icon paths in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FitBounds({ center, radiusKm }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      L.latLngBounds(
        L.latLng(center.lat + radiusKm / 111, center.lng),
        L.latLng(center.lat - radiusKm / 111, center.lng)
      ),
      { padding: [50, 50] }
    );
  }, [map, center, radiusKm]);
  return null;
}

export default function ReachMap() {
  const radiusM = RADIUS_KM * 1000;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-secondary/10">
      <div className="h-[420px]">
        <MapContainer center={[JACZKOWICE.lat, JACZKOWICE.lng]} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[JACZKOWICE.lat, JACZKOWICE.lng]}>
            <Popup><strong>Jaczkowice</strong><br/>Centrum zasięgu 50 km</Popup>
          </Marker>
          <Circle center={[JACZKOWICE.lat, JACZKOWICE.lng]} radius={radiusM} pathOptions={{ color: '#C9A96E', fillOpacity: 0.15 }} />
          <FitBounds center={JACZKOWICE} radiusKm={RADIUS_KM} />
        </MapContainer>
      </div>
      <div className="p-4 flex items-start gap-3">
        <p className="text-sm text-muted-foreground">Dojazd do klienta w promieniu <strong className="text-foreground">50 km</strong> od Jaczkowic, woj. dolnośląskie.</p>
      </div>
    </div>
  );
}