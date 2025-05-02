import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Map from '../components/Map';
import RouteList from '../components/RouteList';
import { Sliders, AlertCircle, Info } from 'lucide-react';

const RoutePlanner: React.FC = () => {
  const {
    buses,
    // students,
    stops,
    routes,
    optimizeRoutes,
    loading
  } = useAppContext();

  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(
    routes.length > 0 ? routes[0].id : undefined
  );

  const [optimizationParams, setOptimizationParams] = useState({
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    elitismCount: 5,
    showAdvanced: false
  });

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setOptimizationParams(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const toggleAdvancedSettings = () => {
    setOptimizationParams(prev => ({
      ...prev,
      showAdvanced: !prev.showAdvanced
    }));
  };

  const handleOptimize = () => {
    // Extract the needed params
    const { populationSize, generations, mutationRate, crossoverRate, elitismCount } = optimizationParams;
    optimizeRoutes();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Route Planner</h1>
        <p className="text-gray-600">Plan and optimize school bus routes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Optimization Controls</h2>
              
              <div className="mb-6">
                <button
                  onClick={handleOptimize}
                  disabled={loading}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {loading ? 'Optimizing...' : 'Run Optimization'}
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Optimization Settings</h3>
                <button 
                  onClick={toggleAdvancedSettings}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <Sliders className="h-3 w-3 mr-1" />
                  {optimizationParams.showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                </button>
              </div>

              {optimizationParams.showAdvanced && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="populationSize" className="block text-xs font-medium text-gray-700 mb-1">
                      Population Size: {optimizationParams.populationSize}
                    </label>
                    <input
                      type="range"
                      id="populationSize"
                      name="populationSize"
                      min="10"
                      max="200"
                      step="10"
                      value={optimizationParams.populationSize}
                      onChange={handleParamChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="generations" className="block text-xs font-medium text-gray-700 mb-1">
                      Generations: {optimizationParams.generations}
                    </label>
                    <input
                      type="range"
                      id="generations"
                      name="generations"
                      min="10"
                      max="500"
                      step="10"
                      value={optimizationParams.generations}
                      onChange={handleParamChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mutationRate" className="block text-xs font-medium text-gray-700 mb-1">
                      Mutation Rate: {optimizationParams.mutationRate.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      id="mutationRate"
                      name="mutationRate"
                      min="0"
                      max="1"
                      step="0.01"
                      value={optimizationParams.mutationRate}
                      onChange={handleParamChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="crossoverRate" className="block text-xs font-medium text-gray-700 mb-1">
                      Crossover Rate: {optimizationParams.crossoverRate.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      id="crossoverRate"
                      name="crossoverRate"
                      min="0"
                      max="1"
                      step="0.01"
                      value={optimizationParams.crossoverRate}
                      onChange={handleParamChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="elitismCount" className="block text-xs font-medium text-gray-700 mb-1">
                      Elitism Count: {optimizationParams.elitismCount}
                    </label>
                    <input
                      type="range"
                      id="elitismCount"
                      name="elitismCount"
                      min="1"
                      max="20"
                      step="1"
                      value={optimizationParams.elitismCount}
                      onChange={handleParamChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 rounded-b-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Optimization Tips</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Higher population size can yield better results but takes longer</li>
                      <li>More generations means more improvement opportunities</li>
                      <li>Balance mutation rate to avoid local optima</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RouteList
            routes={routes}
            buses={buses}
            stops={stops}
            onSelectRoute={setSelectedRouteId}
            selectedRouteId={selectedRouteId}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Route Map</h2>
              <p className="text-sm text-gray-500">Visualize current routes and stops</p>
            </div>
            {/* map here */}
            <div className="h-[600px] p-4">
              <Map
                stops={stops}
                routes={routes}
                buses={buses}
                selectedRouteId={selectedRouteId}
              />
            </div>
          </div>
          
          {routes.some(route => {
            const bus = buses.find(b => b.id === route.busId);
            return bus ? route.totalStudents > bus.capacity : false;
          }) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Overload Warning</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Some buses exceed their capacity. Run the optimization to balance student loads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;