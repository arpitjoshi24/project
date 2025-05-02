import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Map from '../components/Map';
import RouteList from '../components/RouteList';
import OptimizationMetrics from '../components/OptimizationMetrics';
import { Route, Bus } from '../types';

import {
  TrendingDown,
  Users,
 
  AlertCircle,
  Bus as BusIcon,
  MapPin
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    buses,
    students,
    stops,
    routes,
    optimizationResults
  } = useAppContext();

  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(
    routes.length > 0 ? routes[0].id : undefined
  );

  const totalStudents = students.length;
  const totalStops = stops.length;
  const totalRouteDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const overloadedBuses = routes.filter(route => {
    const bus = buses.find(b => b.id === route.busId);
    return bus ? route.totalStudents > bus.capacity : false;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of school bus routes and optimization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          change={"+5 this week"}
          changeType="increase"
        />
        <StatCard
          title="Total Stops"
          value={totalStops}
          icon={<MapPin className="h-6 w-6 text-green-600" />}
          change={"No change"}
          changeType="neutral"
        />
        <StatCard
          title="Total Distance"
          value={`${totalRouteDistance.toFixed(1)} km`}
          icon={<TrendingDown className="h-6 w-6 text-amber-600" />}
          change={optimizationResults ? `-${(optimizationResults.totalDistanceBefore - optimizationResults.totalDistanceAfter).toFixed(1)} km` : "Not optimized"}
          changeType={optimizationResults ? "decrease" : "neutral"}
        />
        <StatCard
          title="Overloaded Buses"
          value={overloadedBuses}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          change={optimizationResults ? `-${optimizationResults.overloadedBusesBefore - optimizationResults.overloadedBusesAfter}` : "Not optimized"}
          changeType={optimizationResults && optimizationResults.overloadedBusesBefore > optimizationResults.overloadedBusesAfter ? "decrease" : "neutral"}
          alert={overloadedBuses > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OptimizationMetrics results={optimizationResults} />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Fleet Summary</h2>
            <div className="space-y-4">
              {buses.map(bus => (
                <BusSummaryCard key={bus.id} bus={bus} routes={routes} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RouteList
            routes={routes}
            buses={buses}
            stops={stops}
            onSelectRoute={setSelectedRouteId}
            selectedRouteId={selectedRouteId}
          />
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Route Map</h2>
          </div>
          <div className="h-[500px] p-4">
            <Map
              stops={stops}
              routes={routes}
              buses={buses}
              selectedRouteId={selectedRouteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  alert = false
}) => {
  const changeColorClass = 
    changeType === 'increase' 
      ? 'text-green-600' 
      : changeType === 'decrease' 
        ? 'text-blue-600' 
        : 'text-gray-500';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${alert ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      </div>
      <div className={`mt-4 text-sm ${changeColorClass}`}>
        {change}
      </div>
    </div>
  );
};

interface BusSummaryCardProps {
  bus: Bus;
  routes: Route[];
}

const BusSummaryCard: React.FC<BusSummaryCardProps> = ({ bus, routes }) => {
  const route = routes.find(r => r.busId === bus.id);
  const usage = route ? (route.totalStudents / bus.capacity) * 100 : 0;
  const overloaded = route ? route.totalStudents > bus.capacity : false;

  return (
    <div className={`border rounded-lg p-4 ${overloaded ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BusIcon className={`h-5 w-5 ${overloaded ? 'text-red-500' : 'text-blue-500'} mr-2`} />
          <h3 className="text-sm font-medium text-gray-900">{bus.name}</h3>
        </div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-700">
            {route ? route.totalStudents : 0}/{bus.capacity}
          </div>
          <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            overloaded 
              ? 'bg-red-100 text-red-800'
              : usage > 90
                ? 'bg-amber-100 text-amber-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {usage.toFixed(0)}%
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              overloaded 
                ? 'bg-red-500'
                : usage > 90
                  ? 'bg-amber-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(usage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <div>
          Stops: {route ? route.stops.length : 0}
        </div>
        <div>
          Distance: {route ? route.totalDistance.toFixed(1) + ' km' : 'N/A'}
        </div>
        <div>
          Time: {route ? route.totalTime + ' min' : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;