export interface Location {
  lat: number;
  lng: number;
}

export interface Bus {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  status: 'available' | 'inUse' | 'maintenance';
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  address: string;
  location: Location;
  stopId: string | null;
  busId: string | null;
}

export interface Stop {
  id: string;
  name: string;
  location: Location;
  studentCount: number;
}

export interface RouteStop {
  stopId: string;
  arrivalTime: string;
  departureTime: string;
  studentsPickedUp: number;
}

export interface Route {
  id: string;
  busId: string;
  stops: RouteStop[];
  totalDistance: number;
  totalTime: number;
  totalStudents: number;
}

export interface GeneticAlgorithmParams {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
}

export interface OptimizationResult {
  optimizedRoutes: Route[];
  previousRoutes: Route[];
  totalDistanceBefore: number;
  totalDistanceAfter: number;
  totalTimeBefore: number;
  totalTimeAfter: number;
  overloadedBusesBefore: number;
  overloadedBusesAfter: number;
  improvementPercentage: number;
}

export type Chromosome = RouteStop[][];
export type Population = Chromosome[];
export type FitnessFunction = (chromosome: Chromosome) => number;
export type CrossoverFunction = (parent1: Chromosome, parent2: Chromosome) => [Chromosome, Chromosome];
export type MutationFunction = (chromosome: Chromosome) => Chromosome;
export type SelectionFunction = (population: Population, fitnesses: number[]) => Chromosome[];