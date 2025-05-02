import React from 'react';
import { useAppContext } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { Student,  } from '../types';

const Students: React.FC = () => {
  const { students, stops, buses } = useAppContext();

  const handleAddStudent = () => {
    // Implementation for adding a new student would go here
    console.log('Add student');
  };

  const handleEditStudent = (student: Student) => {
    // Implementation for editing a student would go here
    console.log('Edit student', student);
  };

  const handleDeleteStudent = (student: Student) => {
    // Implementation for deleting a student would go here
    console.log('Delete student', student);
  };

  const studentColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Grade',
      accessor: 'grade',
    },
    {
      header: 'Address',
      accessor: 'address',
    },
    {
      header: 'Assigned Stop',
      accessor: (student: Student) => {
        const stop = stops.find(s => s.id === student.stopId);
        return stop ? stop.name : 'Unassigned';
      },
    },
    {
      header: 'Assigned Bus',
      accessor: (student: Student) => {
        const bus = buses.find(b => b.id === student.busId);
        return bus ? bus.name : 'Unassigned';
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600">Manage and assign students to stops and buses</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DataTable<Student>
          title="Student Directory"
          description="View and manage all students in the system"
          data={students}
          columns={studentColumns}
          keyField="id"
          onAdd={handleAddStudent}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          searchPlaceholder="Search students..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Grade Distribution</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Bar chart visualization would go here
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Stop Assignment</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Pie chart visualization would go here
          </div>
        </div>
      </div>
    </div>
  )
  
};

export default Students;