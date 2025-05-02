// utils/routeCalculations.ts
import { Location } from '../types';

// Sample data for Bhimtal-Haldwani route
export const BHIMTAL_HALDWANI_STOPS: Array<{
  name: string;
  location: Location;
  studentCount?: number;
}> = [
  {
    name: "Bhimtal Bus Stand",
    location: { lat: 29.3474, lng: 79.5632 },
    studentCount: 20
  },
  {
    name: "Tallital",
    location: { lat: 29.3919, lng: 79.4542 },
    studentCount: 15
  },
  {
    name: "Kathgodam",
    location: { lat: 29.2672, lng: 79.5456 },
    studentCount: 25
  },
  {
    name: "Haldwani Bus Station",
    location: { lat: 29.2215, lng: 79.5279 },
    studentCount: 30
  }
];

export const BHIMTAL_HALDWANI_ROUTE = {
  id: "bhimtal-haldwani",
  name: "Bhimtal to Haldwani",
  stops: BHIMTAL_HALDWANI_STOPS.map((stop, index) => ({
    stopId: `stop-${index}`,
    sequence: index
  }))
};

/**
 * Calculate distance between two locations using Haversine formula (in km)
 */
export const calculateDistance = (location1: Location, location2: Location): number => {
  const R = 6371; // Earth radius in km
  const φ1 = location1.lat * Math.PI/180;
  const φ2 = location2.lat * Math.PI/180;
  const Δφ = (location2.lat - location1.lat) * Math.PI/180;
  const Δλ = (location2.lng - location1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
};

/**
 * Calculate travel time with terrain factors
 */
export const calculateTravelTime = (distanceKm: number, terrain: 'hilly' | 'urban' = 'hilly'): number => {
  // Adjusted speeds for hilly terrain (Bhimtal area)
  const speedKmh = terrain === 'hilly' ? 25 : 30;
  const baseMinutes = (distanceKm / speedKmh) * 60;
  
  // Additional time for hilly terrain curves
  const terrainFactor = terrain === 'hilly' ? 1.3 : 1;
  
  return Math.ceil(baseMinutes * terrainFactor);
};

/**
 * Generate complete route timing
 */
export const generateRouteTiming = (startTime: Date | string) => {
  const start = typeof startTime === 'string' ? parseTimeString(startTime) : startTime;
  const timings: Array<{
    stopName: string;
    arrivalTime: string;
    distanceFromPrev: number;
    travelTimeFromPrev: number;
  }> = [];

  let totalDistance = 0;
  let cumulativeTime = 0;

  for (let i = 0; i < BHIMTAL_HALDWANI_STOPS.length; i++) {
    let distanceFromPrev = 0;
    let travelTime = 0;

    if (i > 0) {
      distanceFromPrev = calculateDistance(
        BHIMTAL_HALDWANI_STOPS[i-1].location,
        BHIMTAL_HALDWANI_STOPS[i].location
      );
      travelTime = calculateTravelTime(distanceFromPrev, 'hilly');
      totalDistance += distanceFromPrev;
      cumulativeTime += travelTime;
    }

    timings.push({
      stopName: BHIMTAL_HALDWANI_STOPS[i].name,
      arrivalTime: formatTimeString(
        new Date(start.getTime() + cumulativeTime * 60000)
      ),
      distanceFromPrev,
      travelTimeFromPrev: travelTime
    });
  }

  return {
    routeName: BHIMTAL_HALDWANI_ROUTE.name,
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    totalTravelTime: cumulativeTime,
    stops: timings
  };
};

// Helper functions (unchanged)
export const formatTimeString = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const parseTimeString = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};