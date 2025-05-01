import React, { useState } from 'react';
import { Save, RefreshCw, Mail, MapPin, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Valley High School',
    schoolAddress: '123 Education Ave, Springfield, IL',
    schoolLocation: { lat: 37.7749, lng: -122.4194 },
    startTime: '08:00',
    endTime: '15:30',
    notifyParents: true,
    maxRouteTime: 60,
    maxStudentsPerStop: 15,
    trafficData: true,
    weatherData: true
  });

  const [gaSettings, setGaSettings] = useState({
    defaultPopulationSize: 50,
    defaultGenerations: 100,
    defaultMutationRate: 0.1,
    defaultCrossoverRate: 0.8,
    defaultElitismCount: 5
  });

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleGaSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setGaSettings({
      ...gaSettings,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSaveSettings = () => {
    // Implementation for saving settings would go here
    console.log('Save settings', { settings, gaSettings });
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    // Implementation for resetting settings would go here
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      console.log('Reset settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure the route planning system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">School Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  School Address
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="schoolAddress"
                    name="schoolAddress"
                    value={settings.schoolAddress}
                    onChange={handleSettingChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    School Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={settings.startTime}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    School End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={settings.endTime}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Route Constraints</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="maxRouteTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Route Time (minutes): {settings.maxRouteTime}
                </label>
                <input
                  type="range"
                  id="maxRouteTime"
                  name="maxRouteTime"
                  min="30"
                  max="120"
                  step="5"
                  value={settings.maxRouteTime}
                  onChange={handleSettingChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label htmlFor="maxStudentsPerStop" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Students Per Stop: {settings.maxStudentsPerStop}
                </label>
                <input
                  type="range"
                  id="maxStudentsPerStop"
                  name="maxStudentsPerStop"
                  min="5"
                  max="30"
                  step="1"
                  value={settings.maxStudentsPerStop}
                  onChange={handleSettingChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Optimization Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="defaultPopulationSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Population Size
                </label>
                <input
                  type="number"
                  id="defaultPopulationSize"
                  name="defaultPopulationSize"
                  min="10"
                  max="200"
                  value={gaSettings.defaultPopulationSize}
                  onChange={handleGaSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="defaultGenerations" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Generations
                </label>
                <input
                  type="number"
                  id="defaultGenerations"
                  name="defaultGenerations"
                  min="10"
                  max="500"
                  value={gaSettings.defaultGenerations}
                  onChange={handleGaSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="defaultMutationRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Mutation Rate
                </label>
                <input
                  type="number"
                  id="defaultMutationRate"
                  name="defaultMutationRate"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gaSettings.defaultMutationRate}
                  onChange={handleGaSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="defaultCrossoverRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Crossover Rate
                </label>
                <input
                  type="number"
                  id="defaultCrossoverRate"
                  name="defaultCrossoverRate"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gaSettings.defaultCrossoverRate}
                  onChange={handleGaSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="defaultElitismCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Elitism Count
                </label>
                <input
                  type="number"
                  id="defaultElitismCount"
                  name="defaultElitismCount"
                  min="1"
                  max="20"
                  value={gaSettings.defaultElitismCount}
                  onChange={handleGaSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Options</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyParents"
                  name="notifyParents"
                  checked={settings.notifyParents}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyParents" className="ml-2 block text-sm text-gray-700">
                  Notify parents of route changes
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trafficData"
                  name="trafficData"
                  checked={settings.trafficData}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="trafficData" className="ml-2 block text-sm text-gray-700">
                  Include real-time traffic data in optimization
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="weatherData"
                  name="weatherData"
                  checked={settings.weatherData}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="weatherData" className="ml-2 block text-sm text-gray-700">
                  Include weather conditions in optimization
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Optimization Notice</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Changing optimization settings will apply to future route calculations only. 
                    Existing routes will not be automatically recalculated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleResetSettings}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;