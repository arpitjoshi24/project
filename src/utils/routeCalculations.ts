import { Location } from '../types';

/**
 * Calculate distance between two locations using the Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (location1: Location, location2: Location): number => {
  const earthRadius = 6371; // Radius of the earth in km
  const lat1 = location1.lat;
  const lon1 = location1.lng;
  const lat2 = location2.lat;
  const lon2 = location2.lng;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * Math.PI / 180;
};

/**
 * Estimate travel time based on distance
 * Returns time in minutes
 */
export const calculateTravelTime = (distanceKm: number): number => {
  // Assuming average speed of 30 km/h for a school bus in urban areas
  const averageSpeedKmh = 30;
  
  // Time in hours
  const timeHours = distanceKm / averageSpeedKmh;
  
  // Convert to minutes
  const timeMinutes = timeHours * 60;
  
  // Add a small buffer for stops, traffic lights, etc.
  const buffer = 2;
  
  return Math.ceil(timeMinutes + buffer);
};

/**
 * Calculate estimated arrival time at a stop
 */
export const calculateArrivalTime = (startTime: Date, travelTimeMinutes: number): Date => {
  const arrivalTime = new Date(startTime);
  arrivalTime.setMinutes(arrivalTime.getMinutes() + travelTimeMinutes);
  return arrivalTime;
};

/**
 * Format a Date object as a time string (HH:MM)
 */
export const formatTimeString = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Parse a time string (HH:MM) into a Date object
 */
export const parseTimeString = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};