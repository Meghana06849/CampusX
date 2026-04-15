import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { studentsAPI, applicationsAPI } from '@/services/api';
import socketService from '@/services/socket';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    placementPercentage: 0,
    totalApplications: 0,
  });
  const [companyStats, setCompanyStats] = useState([]);
  const [applicationStats, setApplicationStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, applicationsRes, companyRes] = await Promise.all([
          studentsAPI.getAllStudents(),
          applicationsAPI.getAllApplications(),
          applicationsAPI.getCompanyStats(),
        ]);

        const { totalStudents, placedStudents, placementPercentage } = studentsRes.data;
        const { stats: appStats } = applicationsRes.data;

        setStats({
          totalStudents,
          placedStudents,
          placementPercentage: parseFloat(placementPercentage),
          totalApplications: appStats.total,
        });

        const companyData = companyRes.data.stats.map((stat) => ({
          name: stat._id,
          students: stat.count,
          avgSalary: Math.round(stat.avgSalary || 0),
        }));
        setCompanyStats(companyData);

        setApplicationStats([
          { name: 'Applied', value: appStats.applied, fill: '#3b82f6' },
          { name: 'Interview', value: appStats.interview, fill: '#f59e0b' },
          { name: 'Selected', value: appStats.selected, fill: '#10b981' },
          { name: 'Rejected', value: appStats.rejected, fill: '#ef4444' },
        ]);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Connect to socket and listen for updates
    socketService.connect();
    socketService.on('studentAdded', loadDashboardData);
    socketService.on('applicationUpdated', loadDashboardData);
    const pollingTimer = setInterval(loadDashboardData, 15000);

    return () => {
      socketService.off('studentAdded', loadDashboardData);
      socketService.off('applicationUpdated', loadDashboardData);
      clearInterval(pollingTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to TPO Student Tracker</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Students"
                value={stats.totalStudents}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Placed Students"
                value={stats.placedStudents}
                icon={TrendingUp}
                color="green"
              />
              <StatsCard
                title="Placement %"
                value={`${stats.placementPercentage}%`}
                icon={TrendingUp}
                color="purple"
              />
              <StatsCard
                title="Total Applications"
                value={stats.totalApplications}
                icon={Building2}
                color="orange"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Status Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={applicationStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {applicationStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Companies Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Hiring Companies
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={companyStats.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
