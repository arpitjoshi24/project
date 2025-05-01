import { Bus, Student, Stop, Route, RouteStop, Location } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate demo data for the application
 */
export const generateInitialData = () => {
  // Generate buses
  const buses: Bus[] = Array(5).fill(null).map((_, index) => ({
    id: uuidv4(),
    name: `Bus ${index + 1}`,
    capacity: 40 + Math.floor(Math.random() * 20), // 40-60 capacity
    currentLoad: 0,
    status: 'available'
  }));
  
  // Generate stops with random locations around a center point
  const centerLocation: Location = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const stops: Stop[] = Array(20).fill(null).map((_, index) => {
    // Generate location within ~5km of center
    const location: Location = {
      lat: centerLocation.lat + (Math.random() - 0.5) * 0.1,
      lng: centerLocation.lng + (Math.random() - 0.5) * 0.1
    };
    
    return {
      id: uuidv4(),
      name: `Stop ${index + 1}`,
      location,
      studentCount: 5 + Math.floor(Math.random() * 10) // 5-15 students per stop
    };
  });
  
  // Generate students
  const students: Student[] = [];
  stops.forEach(stop => {
    for (let i = 0; i < stop.studentCount; i++) {
      // Generate student location near the stop
      const studentLocation: Location = {
        lat: stop.location.lat + (Math.random() - 0.5) * 0.01,
        lng: stop.location.lng + (Math.random() - 0.5) * 0.01
      };
      
      students.push({
        id: uuidv4(),
        name: `Student ${students.length + 1}`,
        grade: Math.floor(Math.random() * 12) + 1, // Grades 1-12
        address: `${Math.floor(Math.random() * 9000) + 1000} Example St.`,
        location: studentLocation,
        stopId: stop.id,
        busId: null // Will be assigned later
      });
    }
  });
  
  // Generate initial routes - simple allocation of stops to buses
  const routes: Route[] = [];
  const stopsPerBus = Math.ceil(stops.length / buses.length);
  
  buses.forEach((bus, busIndex) => {
    const busStops = stops.slice(
      busIndex * stopsPerBus, 
      Math.min((busIndex + 1) * stopsPerBus, stops.length)
    );
    
    // Start time for the route
    const startTime = new Date();
    startTime.setHours(7, 0, 0, 0); // 7:00 AM
    
    // Create route stops with sequential times
    const routeStops: RouteStop[] = busStops.map((stop, stopIndex) => {
      const arrivalTime = new Date(startTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + stopIndex * 15); // 15 minutes between stops
      
      const departureTime = new Date(arrivalTime);
      departureTime.setMinutes(departureTime.getMinutes() + 5); // 5 minutes at each stop
      
      return {
        stopId: stop.id,
        arrivalTime: `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
        departureTime: `${departureTime.getHours().toString().padStart(2, '0')}:${departureTime.getMinutes().toString().padStart(2, '0')}`,
        studentsPickedUp: stop.studentCount
      };
    });
    
    // Assign students to this bus
    busStops.forEach(stop => {
      students
        .filter(student => student.stopId === stop.id)
        .forEach(student => {
          student.busId = bus.id;
        });
    });
    
    // Calculate total students
    const totalStudents = routeStops.reduce(
      (sum, routeStop) => sum + routeStop.studentsPickedUp, 0
    );
    
    // Update bus load
    bus.currentLoad = totalStudents;
    
    // Calculate total distance and time (simplified)
    const totalDistance = routeStops.length * 3; // Approx 3km between stops
    const totalTime = routeStops.length * 15; // 15 minutes per stop
    
    routes.push({
      id: uuidv4(),
      busId: bus.id,
      stops: routeStops,
      totalDistance,
      totalTime,
      totalStudents
    });
  });
  
  return { buses, students, stops, routes };
};