import { 
  Bus, Student, Stop, Route, Chromosome, Population, 
  OptimizationResult, RouteStop, GeneticAlgorithmParams
} from '../types';
import { calculateDistance, calculateTravelTime } from './routeCalculations';

// Default GA parameters
const DEFAULT_PARAMS: GeneticAlgorithmParams = {
  populationSize: 50,
  generations: 100,
  mutationRate: 0.1,
  crossoverRate: 0.8,
  elitismCount: 5
};

/**
 * Main function to run the genetic algorithm and optimize routes
 */
export const runGeneticAlgorithm = async (
  buses: Bus[], 
  students: Student[], 
  stops: Stop[],
  params: Partial<GeneticAlgorithmParams> = {}
): Promise<OptimizationResult> => {
  // Merge default params with provided params
  const gaParams = { ...DEFAULT_PARAMS, ...params };

  // Store original routes for comparison
  const previousRoutes = generateInitialRoutes(buses, stops, students);
  
  // Initialize population
  const initialPopulation = initializePopulation(buses, stops, students, gaParams.populationSize);
  
  // Calculate fitness for initial population
  const fitnesses = initialPopulation.map(chromosome => 
    calculateFitness(chromosome, buses, stops, students)
  );
  
  // Run GA for specified generations
  let currentPopulation = initialPopulation;
  let currentFitnesses = fitnesses;
  
  for (let i = 0; i < gaParams.generations; i++) {
    // Use selection, crossover, and mutation to evolve the population
    const selectedParents = selection(currentPopulation, currentFitnesses, gaParams.elitismCount);
    const newPopulation = crossover(selectedParents, gaParams.crossoverRate);
    currentPopulation = mutation(newPopulation, gaParams.mutationRate);
    
    // Recalculate fitness values
    currentFitnesses = currentPopulation.map(chromosome => 
      calculateFitness(chromosome, buses, stops, students)
    );
  }
  
  // Find the best chromosome
  const bestIndex = currentFitnesses.indexOf(Math.max(...currentFitnesses));
  const bestChromosome = currentPopulation[bestIndex];
  
  // Convert best chromosome to routes
  const optimizedRoutes = chromosomeToRoutes(bestChromosome, buses, stops, students);
  
  // Calculate metrics for comparison
  const totalDistanceBefore = calculateTotalDistance(previousRoutes, stops);
  const totalDistanceAfter = calculateTotalDistance(optimizedRoutes, stops);
  const totalTimeBefore = calculateTotalTime(previousRoutes);
  const totalTimeAfter = calculateTotalTime(optimizedRoutes);
  const overloadedBusesBefore = countOverloadedBuses(previousRoutes, buses);
  const overloadedBusesAfter = countOverloadedBuses(optimizedRoutes, buses);
  const improvementPercentage = ((totalDistanceBefore - totalDistanceAfter) / totalDistanceBefore) * 100;
  
  return {
    optimizedRoutes,
    previousRoutes,
    totalDistanceBefore,
    totalDistanceAfter,
    totalTimeBefore,
    totalTimeAfter,
    overloadedBusesBefore,
    overloadedBusesAfter,
    improvementPercentage
  };
};

/**
 * Initialize a random population of chromosomes
 */
const initializePopulation = (
  buses: Bus[],
  stops: Stop[],
  students: Student[],
  populationSize: number
): Population => {
  const population: Population = [];
  
  for (let i = 0; i < populationSize; i++) {
    population.push(createRandomChromosome(buses, stops, students));
  }
  
  return population;
};

/**
 * Create a random chromosome that represents a complete set of routes
 */
const createRandomChromosome = (
  buses: Bus[],
  stops: Stop[],
  students: Student[]
): Chromosome => {
  const busCount = buses.length;
  const stopCount = stops.length;
  const chromosome: Chromosome = Array(busCount).fill(null).map(() => []);
  
  // Create a copy of stops to shuffle
  const stopsList = [...stops];
  
  // Shuffle stops
  for (let i = stopsList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stopsList[i], stopsList[j]] = [stopsList[j], stopsList[i]];
  }
  
  // Assign stops to buses randomly
  stopsList.forEach((stop, index) => {
    const busIndex = index % busCount;
    const routeStop: RouteStop = {
      stopId: stop.id,
      arrivalTime: "07:00", // Default time, will be calculated later
      departureTime: "07:05",
      studentsPickedUp: stop.studentCount
    };
    chromosome[busIndex].push(routeStop);
  });
  
  return chromosome;
};

/**
 * Calculate fitness value for a chromosome
 */
const calculateFitness = (
  chromosome: Chromosome,
  buses: Bus[],
  stops: Stop[],
  students: Student[]
): number => {
  // Convert chromosome to routes for calculation
  const routes = chromosomeToRoutes(chromosome, buses, stops, students);
  
  // Calculate total distance
  const totalDistance = calculateTotalDistance(routes, stops);
  
  // Calculate overload penalty
  const overloadPenalty = calculateOverloadPenalty(routes, buses);
  
  // Calculate time constraints penalty
  const timeConstraintsPenalty = calculateTimeConstraintsPenalty(routes);
  
  // Final fitness formula (higher is better)
  const fitness = (
    (1000 / (totalDistance + 1)) + 
    (1000 / (overloadPenalty + 1)) + 
    (1000 / (timeConstraintsPenalty + 1))
  );
  
  return fitness;
};

/**
 * Selection function to choose parents for next generation
 */
const selection = (
  population: Population,
  fitnesses: number[],
  elitismCount: number
): Population => {
  const populationSize = population.length;
  const selected: Population = [];
  
  // Elitism - directly copy the best chromosomes
  const indexesByFitness = [...fitnesses.keys()].sort((a, b) => fitnesses[b] - fitnesses[a]);
  for (let i = 0; i < elitismCount; i++) {
    if (i < indexesByFitness.length) {
      selected.push([...population[indexesByFitness[i]]]);
    }
  }
  
  // Tournament selection for the rest
  while (selected.length < populationSize) {
    // Select 3 random chromosomes for tournament
    const tournamentSize = 3;
    const tournamentIndices = Array(tournamentSize).fill(0).map(() => 
      Math.floor(Math.random() * populationSize)
    );
    
    // Find the best in tournament
    let bestIndex = tournamentIndices[0];
    for (let i = 1; i < tournamentIndices.length; i++) {
      if (fitnesses[tournamentIndices[i]] > fitnesses[bestIndex]) {
        bestIndex = tournamentIndices[i];
      }
    }
    
    // Add winner to selected
    selected.push([...population[bestIndex]]);
  }
  
  return selected;
};

/**
 * Crossover function to create new chromosomes from parents
 */
const crossover = (
  population: Population,
  crossoverRate: number
): Population => {
  const newPopulation: Population = [];
  
  // Process pairs of parents
  for (let i = 0; i < population.length; i += 2) {
    if (i + 1 < population.length) {
      const parent1 = population[i];
      const parent2 = population[i + 1];
      
      // Apply crossover based on crossover rate
      if (Math.random() < crossoverRate) {
        // Create two children using route-based crossover
        const [child1, child2] = routeBasedCrossover(parent1, parent2);
        newPopulation.push(child1, child2);
      } else {
        // No crossover, copy parents
        newPopulation.push([...parent1], [...parent2]);
      }
    } else {
      // Odd number of parents, just copy the last one
      newPopulation.push([...population[i]]);
    }
  }
  
  return newPopulation;
};

/**
 * Route-based crossover that swaps routes between parents
 */
const routeBasedCrossover = (
  parent1: Chromosome,
  parent2: Chromosome
): [Chromosome, Chromosome] => {
  const busCount = parent1.length;
  const child1: Chromosome = Array(busCount).fill(null).map(() => []);
  const child2: Chromosome = Array(busCount).fill(null).map(() => []);
  
  // For each bus route, randomly decide which parent to take from
  for (let i = 0; i < busCount; i++) {
    if (Math.random() < 0.5) {
      child1[i] = [...parent1[i]];
      child2[i] = [...parent2[i]];
    } else {
      child1[i] = [...parent2[i]];
      child2[i] = [...parent1[i]];
    }
  }
  
  return [child1, child2];
};

/**
 * Mutation function to introduce random changes
 */
const mutation = (
  population: Population,
  mutationRate: number
): Population => {
  return population.map(chromosome => {
    // Apply mutation based on mutation rate
    if (Math.random() < mutationRate) {
      return mutateChromosome(chromosome);
    }
    return chromosome;
  });
};

/**
 * Mutate a chromosome by swapping stops or changing route order
 */
const mutateChromosome = (chromosome: Chromosome): Chromosome => {
  const mutatedChromosome = [...chromosome.map(route => [...route])];
  const busCount = chromosome.length;
  
  // Choose mutation type
  const mutationType = Math.floor(Math.random() * 3);
  
  if (mutationType === 0) {
    // Swap stops between two buses
    const bus1Index = Math.floor(Math.random() * busCount);
    const bus2Index = Math.floor(Math.random() * busCount);
    
    if (bus1Index !== bus2Index && 
        mutatedChromosome[bus1Index].length > 0 && 
        mutatedChromosome[bus2Index].length > 0) {
      const stop1Index = Math.floor(Math.random() * mutatedChromosome[bus1Index].length);
      const stop2Index = Math.floor(Math.random() * mutatedChromosome[bus2Index].length);
      
      // Swap stops
      const temp = mutatedChromosome[bus1Index][stop1Index];
      mutatedChromosome[bus1Index][stop1Index] = mutatedChromosome[bus2Index][stop2Index];
      mutatedChromosome[bus2Index][stop2Index] = temp;
    }
  } else if (mutationType === 1) {
    // Change order within a route
    const busIndex = Math.floor(Math.random() * busCount);
    
    if (mutatedChromosome[busIndex].length > 1) {
      const stop1Index = Math.floor(Math.random() * mutatedChromosome[busIndex].length);
      let stop2Index = Math.floor(Math.random() * mutatedChromosome[busIndex].length);
      
      // Ensure different indices
      while (stop1Index === stop2Index) {
        stop2Index = Math.floor(Math.random() * mutatedChromosome[busIndex].length);
      }
      
      // Swap positions
      const temp = mutatedChromosome[busIndex][stop1Index];
      mutatedChromosome[busIndex][stop1Index] = mutatedChromosome[busIndex][stop2Index];
      mutatedChromosome[busIndex][stop2Index] = temp;
    }
  } else {
    // Move a stop from one bus to another
    const fromBusIndex = Math.floor(Math.random() * busCount);
    const toBusIndex = Math.floor(Math.random() * busCount);
    
    if (fromBusIndex !== toBusIndex && mutatedChromosome[fromBusIndex].length > 0) {
      const stopIndex = Math.floor(Math.random() * mutatedChromosome[fromBusIndex].length);
      const stop = mutatedChromosome[fromBusIndex][stopIndex];
      
      // Remove from source bus
      mutatedChromosome[fromBusIndex].splice(stopIndex, 1);
      
      // Add to destination bus
      mutatedChromosome[toBusIndex].push(stop);
    }
  }
  
  return mutatedChromosome;
};

// Utility functions for fitness calculation and route conversion

const calculateTotalDistance = (routes: Route[], stops: Stop[]): number => {
  let totalDistance = 0;
  
  for (const route of routes) {
    let previousStopLocation = null;
    
    for (const routeStop of route.stops) {
      const currentStop = stops.find(s => s.id === routeStop.stopId);
      
      if (!currentStop) continue;
      
      if (previousStopLocation) {
        const distance = calculateDistance(
          previousStopLocation, 
          currentStop.location
        );
        totalDistance += distance;
      } else {
        // First stop - assume distance from school
        const schoolLocation = { lat: 37.7749, lng: -122.4194 }; // Example coordinates
        const distance = calculateDistance(
          schoolLocation, 
          currentStop.location
        );
        totalDistance += distance;
      }
      
      previousStopLocation = currentStop.location;
    }
  }
  
  return totalDistance;
};

const calculateTotalTime = (routes: Route[]): number => {
  return routes.reduce((total, route) => total + route.totalTime, 0);
};

const calculateOverloadPenalty = (routes: Route[], buses: Bus[]): number => {
  let penalty = 0;
  
  for (const route of routes) {
    const bus = buses.find(b => b.id === route.busId);
    if (!bus) continue;
    
    const overload = Math.max(0, route.totalStudents - bus.capacity);
    penalty += overload * 10; // Heavy penalty for overloaded buses
  }
  
  return penalty;
};

const calculateTimeConstraintsPenalty = (routes: Route[]): number => {
  let penalty = 0;
  const schoolStartTime = new Date();
  schoolStartTime.setHours(8, 0, 0, 0); // 8:00 AM
  
  for (const route of routes) {
    const lastStop = route.stops[route.stops.length - 1];
    if (!lastStop) continue;
    
    // Check if last stop's arrival time is after school start time
    const arrivalTimeParts = lastStop.arrivalTime.split(':');
    const arrivalTime = new Date();
    arrivalTime.setHours(
      parseInt(arrivalTimeParts[0]), 
      parseInt(arrivalTimeParts[1]), 
      0, 0
    );
    
    if (arrivalTime > schoolStartTime) {
      // Calculate minutes late
      const minutesLate = (arrivalTime.getTime() - schoolStartTime.getTime()) / (1000 * 60);
      penalty += minutesLate * 5; // 5 points per minute late
    }
  }
  
  return penalty;
};

const countOverloadedBuses = (routes: Route[], buses: Bus[]): number => {
  let count = 0;
  
  for (const route of routes) {
    const bus = buses.find(b => b.id === route.busId);
    if (!bus) continue;
    
    if (route.totalStudents > bus.capacity) {
      count += 1;
    }
  }
  
  return count;
};

const chromosomeToRoutes = (
  chromosome: Chromosome,
  buses: Bus[],
  stops: Stop[],
  students: Student[]
): Route[] => {
  return chromosome.map((busRoute, index) => {
    const bus = buses[index];
    
    // Calculate total students for this route
    const totalStudents = busRoute.reduce(
      (sum, routeStop) => sum + routeStop.studentsPickedUp, 0
    );
    
    // Calculate distance and time
    let totalDistance = 0;
    let totalTime = 0;
    let previousLocation = { lat: 37.7749, lng: -122.4194 }; // School location
    
    // For each stop, calculate arrival and departure times
    const updatedStops = busRoute.map((routeStop, stopIndex) => {
      const stop = stops.find(s => s.id === routeStop.stopId);
      if (!stop) return routeStop;
      
      // Calculate distance from previous location
      const distance = calculateDistance(previousLocation, stop.location);
      totalDistance += distance;
      
      // Calculate travel time based on distance
      const travelTime = calculateTravelTime(distance);
      totalTime += travelTime;
      
      // Calculate arrival time
      const arrivalTime = new Date();
      arrivalTime.setHours(7, 0, 0, 0); // Start at 7:00 AM
      arrivalTime.setMinutes(arrivalTime.getMinutes() + totalTime);
      
      // 5 minutes at each stop for boarding
      const departureTime = new Date(arrivalTime);
      departureTime.setMinutes(departureTime.getMinutes() + 5);
      
      previousLocation = stop.location;
      
      return {
        ...routeStop,
        arrivalTime: `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
        departureTime: `${departureTime.getHours().toString().padStart(2, '0')}:${departureTime.getMinutes().toString().padStart(2, '0')}`
      };
    });
    
    return {
      id: `route-${bus.id}`,
      busId: bus.id,
      stops: updatedStops,
      totalDistance,
      totalTime,
      totalStudents
    };
  });
};

const generateInitialRoutes = (
  buses: Bus[],
  stops: Stop[],
  students: Student[]
): Route[] => {
  // Simple greedy approach for initial routes
  const routes: Route[] = [];
  const stopsPerBus = Math.ceil(stops.length / buses.length);
  
  buses.forEach((bus, busIndex) => {
    const busStops = stops.slice(
      busIndex * stopsPerBus, 
      Math.min((busIndex + 1) * stopsPerBus, stops.length)
    );
    
    // Create route stops with default times
    const routeStops: RouteStop[] = busStops.map(stop => ({
      stopId: stop.id,
      arrivalTime: "07:00",
      departureTime: "07:05",
      studentsPickedUp: stop.studentCount
    }));
    
    // Calculate total students
    const totalStudents = routeStops.reduce(
      (sum, routeStop) => sum + routeStop.studentsPickedUp, 0
    );
    
    routes.push({
      id: `route-${bus.id}`,
      busId: bus.id,
      stops: routeStops,
      totalDistance: 0, // Will be calculated later
      totalTime: 0, // Will be calculated later
      totalStudents
    });
  });
  
  return routes;
};