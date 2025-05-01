import React, { useEffect, useRef } from 'react';
import { Stop, Route, Bus } from '../types';

interface MapProps {
  stops: Stop[];
  routes: Route[];
  buses: Bus[];
  selectedRouteId?: string;
}

const Map: React.FC<MapProps> = ({ stops, routes, buses, selectedRouteId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routePathsRef = useRef<any[]>([]);

  // Initialize map on component mount
  useEffect(() => {
    // This is a placeholder for an actual map implementation
    // In a real application, you would use a library like Google Maps, Mapbox, or Leaflet
    if (mapRef.current && !mapInstanceRef.current) {
      const mapElement = mapRef.current;
      
      // Create a simple map simulation for demonstration purposes
      const mapContainer = document.createElement('div');
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';
      mapContainer.style.backgroundColor = '#e5e7eb';
      mapContainer.style.borderRadius = '0.5rem';
      mapContainer.style.position = 'relative';
      mapContainer.style.overflow = 'hidden';
      
      const mapOverlay = document.createElement('div');
      mapOverlay.style.position = 'absolute';
      mapOverlay.style.top = '50%';
      mapOverlay.style.left = '50%';
      mapOverlay.style.transform = 'translate(-50%, -50%)';
      mapOverlay.style.textAlign = 'center';
      mapOverlay.innerHTML = `
        <div class="text-gray-500">
          <p class="text-lg font-medium">Interactive Map</p>
          <p class="text-sm">(Simulated for demonstration)</p>
        </div>
      `;
      
      mapContainer.appendChild(mapOverlay);
      mapElement.appendChild(mapContainer);
      
      mapInstanceRef.current = {
        container: mapContainer,
        overlay: mapOverlay
      };
    }
    
    return () => {
      // Cleanup on unmount
      markersRef.current = [];
      routePathsRef.current = [];
    };
  }, []);

  // Update map when stops, routes, or selected route changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing markers and paths
    markersRef.current.forEach(marker => {
      // In a real app, you would remove markers from the map
    });
    markersRef.current = [];
    
    routePathsRef.current.forEach(path => {
      // In a real app, you would remove paths from the map
    });
    routePathsRef.current = [];
    
    // Add stop markers
    stops.forEach(stop => {
      // In a real app, you would add markers to the map using stop.location
      const marker = {
        id: stop.id,
        position: stop.location
      };
      markersRef.current.push(marker);
    });
    
    // Add route paths
    routes.forEach(route => {
      const isSelected = selectedRouteId === route.id;
      const bus = buses.find(b => b.id === route.busId);
      
      if (!bus) return;
      
      // In a real app, you would draw paths between stops for each route
      const routePath = {
        id: route.id,
        busId: route.busId,
        stops: route.stops.map(rs => {
          const stop = stops.find(s => s.id === rs.stopId);
          return stop ? stop.location : null;
        }).filter(Boolean),
        isSelected
      };
      routePathsRef.current.push(routePath);
    });
    
    // Update the overlay with some route information
    if (selectedRouteId) {
      const selectedRoute = routes.find(r => r.id === selectedRouteId);
      const bus = selectedRoute ? buses.find(b => b.id === selectedRoute.busId) : null;
      
      if (selectedRoute && bus && mapInstanceRef.current.overlay) {
        mapInstanceRef.current.overlay.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-md">
            <p class="text-lg font-medium text-blue-700">${bus.name}</p>
            <p class="text-sm text-gray-600">Stops: ${selectedRoute.stops.length}</p>
            <p class="text-sm text-gray-600">Students: ${selectedRoute.totalStudents}/${bus.capacity}</p>
            <p class="text-sm text-gray-600">Distance: ${selectedRoute.totalDistance.toFixed(1)} km</p>
          </div>
        `;
      }
    }
  }, [stops, routes, buses, selectedRouteId]);

  return (
    <div ref={mapRef} className="h-full w-full rounded-lg overflow-hidden shadow-md bg-gray-100">
      {/* Map will be rendered inside this div by the effect hook */}
    </div>
  );
};

export default Map;