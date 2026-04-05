import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { db } from '../../services/db';
import { ActivityLog } from '../../types';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await db.logs.list();
    setLogs(data);
    setLoading(false);
  };

  const getLogColor = (action: string) => {
    if (action.includes('Deleted')) return 'bg-red-500';
    if (action.includes('Created')) return 'bg-green-500';
    if (action.includes('Updated')) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Activity Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">Track all system activities and changes</p>
        </div>
        <button
          onClick={loadLogs}
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <RefreshCw size={20} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Activity Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Activity logs will appear here as you manage your store</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log, i) => (
              <div
                key={log.id || i}
                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex gap-4 items-start"
              >
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getLogColor(log.action)}`}></div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{log.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{log.details}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
