import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, MessageSquare, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { db } from '../../services/db';
import { AdminStats, ActivityLog } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Mock data for chart (could also be fetched from logs in a real scenario)
  const data = [
    { name: 'Mon', enquiries: 4 },
    { name: 'Tue', enquiries: 7 },
    { name: 'Wed', enquiries: 3 },
    { name: 'Thu', enquiries: 8 },
    { name: 'Fri', enquiries: 12 },
    { name: 'Sat', enquiries: 5 },
    { name: 'Sun', enquiries: 2 },
  ];

  useEffect(() => {
    db.stats.get().then(setStats);
    db.logs.list().then(setLogs);
  }, []);

  if (!stats) return <div className="text-gray-900 dark:text-white">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-900 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Package size={24} className="text-white" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Products</p>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total_products}</h3>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-lg border-2 border-green-200 dark:border-green-900 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Enquiries</p>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total_enquiries}</h3>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-lg border-2 border-orange-200 dark:border-orange-900 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
              <MessageSquare size={24} className="text-white" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Pending Action</p>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.pending_enquiries}</h3>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-900 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Coming Soon</p>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.coming_soon_count}</h3>
        </div>
      </div>

      {/* Charts & Logs */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Weekly Enquiries</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                  }}
                  itemStyle={{ color: '#1f2937' }}
                />
                <Bar
                  dataKey="enquiries"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <Activity className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Recent Activity</h3>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
            {logs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No activity recorded yet.</p>
              </div>
            )}
            {logs.map((log, i) => (
              <div
                key={log.id || i}
                className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800"
              >
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${log.action.includes('Deleted') ? 'bg-red-500' :
                    log.action.includes('Created') ? 'bg-green-500' :
                      log.action.includes('Updated') ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{log.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">{log.details}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
