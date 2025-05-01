import React from 'react';
import { useAppContext } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { Bus, Route } from '../types';

const Buses: React.FC = () => {
  const { buses, routes } = useAppContext();

  const handleAddBus = () => {
    // Implementation for adding a new bus would go here
    console.log('Add bus');
  };

  const handleEditBus = (bus: Bus) => {
    // Implementation for editing a bus would go here
    console.log('Edit bus', bus);
  };

  const handleDeleteBus = (bus: Bus) => {
    // Implementation for deleting a bus would go here
    console.log('Delete bus', bus);
  };

  const busColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
    },
    {
      header: 'Current Load',
      accessor: (bus: Bus) => {
        const route = routes.find(r => r.busId === bus.id);
        return route ? route.totalStudents : 0;
      },
    },
    {
      header: 'Utilization',
      accessor: (bus: Bus) => {
        const route = routes.find(r => r.busId === bus.id);
        const utilization = route ? (route.totalStudents / bus.capacity) * 100 : 0;
        return (
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  utilization > 100 
                    ? 'bg-red-500' 
                    : utilization > 85 
                      ? 'bg-amber-500' 
                      : 'bg-green-500'
                }`} 
                style={{ width: `${Math.min(utilization, 100)}%` }}
              ></div>
            </div>
            <span>{utilization.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      className: 'text-center',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buses</h1>
        <p className="text-gray-600">Manage your bus fleet and assignments</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DataTable<Bus>
          title="Bus Fleet"
          description="View and manage all buses in the system"
          data={buses}
          columns={busColumns}
          keyField="id"
          onAdd={handleAddBus}
          onEdit={handleEditBus}
          onDelete={handleDeleteBus}
          searchPlaceholder="Search buses..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fleet Utilization</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Utilization chart would go here
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bus Load Distribution</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Load distribution chart would go here
          </div>
        </div>
      </div>
    </div>
  )
  
};

export default Buses;