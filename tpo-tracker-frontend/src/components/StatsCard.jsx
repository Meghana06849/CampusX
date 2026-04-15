import React from 'react';
import { TrendingUp } from 'lucide-react';

export function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center space-x-1">
              <TrendingUp size={16} />
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-4 rounded-full`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
