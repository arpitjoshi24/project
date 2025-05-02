import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  stops: Array<{
    id: string;
    name: string;
    location: { lat: number; lng: number } | string;
    studentCount?: number;
    assignedRoute?: string;
  }>;
  routes: Array<{
    id: string;
    stops: Array<{ stopId: string }>;
    busId?: string;
  }>;
  selectedRouteId?: string;
}

const Map: React.FC<MapProps> = ({ stops, routes, selectedRouteId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);

  // Initialize map only once
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [37.7749, -122.4194],
        zoom: 12,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and routes when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and polylines
    markersRef.current.forEach(marker => marker.remove());
    polylinesRef.current.forEach(polyline => polyline.remove());
    markersRef.current = [];
    polylinesRef.current = [];

    // Add new markers
    stops.forEach(stop => {
      let lat: number, lng: number;
      
      if (typeof stop.location === 'string') {
        const coords = stop.location.split(',').map(Number);
        if (coords.length !== 2 || coords.some(isNaN)) return;
        [lat, lng] = coords;
      } else {
        lat = stop.location.lat;
        lng = stop.location.lng;
      }

      const marker = L.marker([lat, lng], {
        title: stop.name,
      })
        .bindPopup(`<b>${stop.name}</b><br>Students: ${stop.studentCount || 0}`)
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Add new polylines
    routes.forEach(route => {
      const path = route.stops
        .map(rs => {
          const stop = stops.find(s => s.id === rs.stopId);
          if (!stop?.location) return null;
          
          if (typeof stop.location === 'string') {
            const coords = stop.location.split(',').map(Number);
            if (coords.length !== 2 || coords.some(isNaN)) return null;
            return [coords[0], coords[1]] as [number, number];
          } else {
            return [stop.location.lat, stop.location.lng] as [number, number];
          }
        })
        .filter(Boolean) as [number, number][];

      if (path.length < 2) return;

      const polyline = L.polyline(path, {
        color: route.id === selectedRouteId ? '#EA4335' : '#4285F4',
        weight: route.id === selectedRouteId ? 4 : 2,
        opacity: 0.8,
      }).addTo(mapInstanceRef.current!);

      polylinesRef.current.push(polyline);
    });

    // Fit map to bounds
    if (markersRef.current.length > 0 || polylinesRef.current.length > 0) {
      const bounds = L.latLngBounds(
        [
          ...markersRef.current.map(m => m.getLatLng()),
          ...polylinesRef.current.flatMap(p => p.getLatLngs() as L.LatLng[])
        ]
      );
      mapInstanceRef.current.fitBounds(bounds.pad(0.1));
    }
  }, [stops, routes, selectedRouteId]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '100%',
        width: '100%',
        minHeight: '400px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default Map;