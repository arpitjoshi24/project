import React from 'react';
import { OptimizationResult } from '../types';
import { 
  TrendingDown,
  Clock,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface OptimizationMetricsProps {
  results: OptimizationResult | null;
}

const OptimizationMetrics: React.FC<OptimizationMetricsProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Optimization Results</h2>
        <p className="text-gray-500">No optimization data available. Click "Optimize Routes" to generate results.</p>
      </div>
    );
  }

  const {
    totalDistanceBefore,
    totalDistanceAfter,
    totalTimeBefore,
    totalTimeAfter,
    overloadedBusesBefore,
    overloadedBusesAfter,
    improvementPercentage
  } = results;

  const distanceSaved = totalDistanceBefore - totalDistanceAfter;
  const timeSaved = totalTimeBefore - totalTimeAfter;
  const overloadReduction = overloadedBusesBefore - overloadedBusesAfter;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-1">Optimization Results</h2>
        <p className="text-sm text-gray-500 mb-4">
          Comparison of routes before and after optimization
        </p>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-blue-800">
                {improvementPercentage.toFixed(1)}% Total Improvement
              </h4>
              <p className="text-sm text-blue-600">
                The genetic algorithm has optimized the routes for better efficiency
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Distance Reduction"
            icon={<TrendingDown className="h-6 w-6 text-green-600" />}
            value={`${distanceSaved.toFixed(1)} km`}
            before={`${totalDistanceBefore.toFixed(1)} km`}
            after={`${totalDistanceAfter.toFixed(1)} km`}
            improvement={((distanceSaved / totalDistanceBefore) * 100).toFixed(1)}
            color="green"
          />
          
          <MetricCard
            title="Time Saved"
            icon={<Clock className="h-6 w-6 text-blue-600" />}
            value={`${timeSaved} min`}
            before={`${totalTimeBefore} min`}
            after={`${totalTimeAfter} min`}
            improvement={((timeSaved / totalTimeBefore) * 100).toFixed(1)}
            color="blue"
          />
          
          <MetricCard
            title="Overloaded Buses"
            icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
            value={`${overloadReduction} fewer`}
            before={`${overloadedBusesBefore} buses`}
            after={`${overloadedBusesAfter} buses`}
            improvement={overloadedBusesBefore > 0 
              ? ((overloadReduction / overloadedBusesBefore) * 100).toFixed(1) 
              : "0.0"
            }
            color="amber"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">
            All students are assigned to stops and routes
          </span>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  before: string;
  after: string;
  improvement: string;
  color: 'green' | 'blue' | 'amber' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, icon, value, before, after, improvement, color 
}) => {
  const colorClasses = {
    green: "bg-green-50 border-green-100 text-green-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    red: "bg-red-50 border-red-100 text-red-700"
  };
  
  const valueColorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    amber: "text-amber-600",
    red: "text-red-600"
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${valueColorClasses[color]}`}>{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white">{icon}</div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Before</p>
          <p className="font-medium">{before}</p>
        </div>
        <div>
          <p className="text-gray-500">After</p>
          <p className="font-medium">{after}</p>
        </div>
      </div>
      
      <div className="mt-3 text-xs">
        <p>Improvement: {improvement}%</p>
      </div>
    </div>
  );
};

export default OptimizationMetrics;