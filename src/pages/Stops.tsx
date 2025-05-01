import React from 'react';
import { useAppContext } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { Stop } from '../types';
import Map from '../components/Map';

const Stops: React.FC = () => {
  const { stops, routes, buses } = useAppContext();

  const handleAddStop = () => {
    // Implementation for adding a new stop would go here
    console.log('Add stop');
  };

  const handleEditStop = (stop: Stop) => {
    // Implementation for editing a stop would go here
    console.log('Edit stop', stop);
  };

  const handleDeleteStop = (stop: Stop) => {
    // Implementation for deleting a stop would go here
    console.log('Delete stop', stop);
  };

  const stopColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Student Count',
      accessor: 'studentCount',
    },
    {
      header: 'Location',
      accessor: (stop: Stop) => 
        `${stop.location.lat.toFixed(4)}, ${stop.location.lng.toFixed(4)}`,
    },
    {
      header: 'Assigned Route',
      accessor: (stop: Stop) => {
        const route = routes.find(r => r.stops.some(rs => rs.stopId === stop.id));
        if (!route) return 'Unassigned';
        const bus = buses.find(b => b.id === route.busId);
        return bus ? bus.name : 'Unknown';
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stops</h1>
        <p className="text-gray-600">Manage bus stops and locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DataTable<Stop>
            title="Bus Stops"
            description="View and manage all stops in the system"
            data={stops}
            columns={stopColumns}
            keyField="id"
            onAdd={handleAddStop}
            onEdit={handleEditStop}
            onDelete={handleDeleteStop}
            searchPlaceholder="Search stops..."
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Stop Locations</h2>
            <p className="text-sm text-gray-500">Geographic view of all bus stops</p>
          </div>
          <div className="h-[500px] p-4">
            <Map stops={stops} routes={routes} buses={buses} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Student Density Heatmap</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Heatmap visualization would go here
        </div>
      </div>
    </div>
  )
  
};

export default Stops;