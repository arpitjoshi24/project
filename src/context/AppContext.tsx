import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bus, Student, Stop, Route, OptimizationResult } from '../types';
import { generateInitialData } from '../utils/dataGenerator';
import { runGeneticAlgorithm } from '../utils/geneticAlgorithm';

interface AppContextType {
  buses: Bus[];
  students: Student[];
  stops: Stop[];
  routes: Route[];
  optimizationResults: OptimizationResult | null;
  loading: boolean;
  setBuses: (buses: Bus[]) => void;
  setStudents: (students: Student[]) => void;
  setStops: (stops: Stop[]) => void;
  setRoutes: (routes: Route[]) => void;
  optimizeRoutes: () => void;
  addBus: (bus: Bus) => void;
  addStudent: (student: Student) => void;
  addStop: (stop: Stop) => void;
  updateBus: (id: string, bus: Partial<Bus>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  updateStop: (id: string, stop: Partial<Stop>) => void;
  deleteBus: (id: string) => void;
  deleteStudent: (id: string) => void;
  deleteStop: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize with demo data
  useEffect(() => {
    const initialData = generateInitialData();
    setBuses(initialData.buses);
    setStudents(initialData.students);
    setStops(initialData.stops);
    setRoutes(initialData.routes);
  }, []);

  const optimizeRoutes = async () => {
    setLoading(true);
    try {
      // Run the genetic algorithm
      const results = await runGeneticAlgorithm(buses, students, stops);
      setOptimizationResults(results);
      setRoutes(results.optimizedRoutes);
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBus = (bus: Bus) => {
    setBuses([...buses, bus]);
  };

  const addStudent = (student: Student) => {
    setStudents([...students, student]);
  };

  const addStop = (stop: Stop) => {
    setStops([...stops, stop]);
  };

  const updateBus = (id: string, updatedBus: Partial<Bus>) => {
    setBuses(buses.map(bus => bus.id === id ? { ...bus, ...updatedBus } : bus));
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(student => student.id === id ? { ...student, ...updatedStudent } : student));
  };

  const updateStop = (id: string, updatedStop: Partial<Stop>) => {
    setStops(stops.map(stop => stop.id === id ? { ...stop, ...updatedStop } : stop));
  };

  const deleteBus = (id: string) => {
    setBuses(buses.filter(bus => bus.id !== id));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const deleteStop = (id: string) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  return (
    <AppContext.Provider value={{
      buses,
      students,
      stops,
      routes,
      optimizationResults,
      loading,
      setBuses,
      setStudents,
      setStops,
      setRoutes,
      optimizeRoutes,
      addBus,
      addStudent,
      addStop,
      updateBus,
      updateStudent,
      updateStop,
      deleteBus,
      deleteStudent,
      deleteStop
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};