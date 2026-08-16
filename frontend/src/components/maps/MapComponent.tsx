"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';

export interface MarkerData {
  id: string;
  position: [number, number];
  title: string;
  color?: 'green' | 'yellow' | 'red' | 'blue';
  details?: React.ReactNode;
}

interface MapProps {
  markers: MarkerData[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Controller component to smoothly fly and redirect the map view when center coordinates update
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ markers, center = [18.5204, 73.8567], zoom = 12, className = "h-full w-full" }: MapProps) {
  
  const getIcon = (color: string) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: color === 'blue' ? [28, 45] : [25, 41],
      iconAnchor: color === 'blue' ? [14, 45] : [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <ChangeMapView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={marker.color ? getIcon(marker.color) : getIcon('blue')}
          >
            <Popup>
              <div className="font-semibold text-slate-900">{marker.title}</div>
              {marker.details && <div className="mt-1">{marker.details}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
