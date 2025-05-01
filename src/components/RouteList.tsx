import React, { useState } from 'react';
import { Route, Bus, Stop } from '../types';
import { 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  MapPin, 
  Users 
} from 'lucide-react';

interface RouteListProps {
  routes: Route[];
  buses: Bus[];
  stops: Stop[];
  onSelectRoute: (routeId: string) => void;
  selectedRouteId?: string;
}

const RouteList: React.FC<RouteListProps> = ({ 
  routes, buses, stops, onSelectRoute, selectedRouteId 
}) => {
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({});

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const handleRouteClick = (routeId: string) => {
    onSelectRoute(routeId);
    toggleRoute(routeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Bus Routes</h2>
        <p className="text-sm text-gray-500">Select a route to view details</p>
      </div>
      
      <div className="overflow-y-auto max-h-[600px]">
        {routes.length === 0 ? (
          <div className="p-4 text-gray-500">No routes available</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {routes.map(route => {
              const bus = buses.find(b => b.id === route.busId);
              if (!bus) return null;
              
              const isExpanded = expandedRoutes[route.id] || false;
              const isSelected = selectedRouteId === route.id;
              
              return (
                <li key={route.id} className="bg-white">
                  <div 
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleRouteClick(route.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {bus.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {route.stops.length} stops • {route.totalDistance.toFixed(1)} km
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className={`text-xs font-medium ${
                            route.totalStudents > bus.capacity 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                          }`}>
                            {route.totalStudents}/{bus.capacity}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600">
                            {route.totalTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">ROUTE STOPS</h4>
                      <ul className="space-y-3">
                        {route.stops.map((routeStop, index) => {
                          const stop = stops.find(s => s.id === routeStop.stopId);
                          if (!stop) return null;
                          
                          return (
                            <li key={routeStop.stopId} className="flex items-start">
                              <div className="flex-shrink-0 pt-1">
                                <div className="flex flex-col items-center">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                    index === 0 
                                      ? 'bg-green-100 text-green-600' 
                                      : index === route.stops.length - 1 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    <MapPin className="h-3 w-3" />
                                  </div>
                                  {index < route.stops.length - 1 && (
                                    <div className="h-10 w-0.5 bg-gray-300 mt-1"></div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {stop.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Arrival: {routeStop.arrivalTime} • Students: {routeStop.studentsPickedUp}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RouteList;