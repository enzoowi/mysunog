import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Flame, Bell, Zap, Droplets, Megaphone, AlertTriangle, CheckCircle } from 'lucide-react';

type AlertItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  targetBarangay?: string;
  isActive: boolean;
  createdAt: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  fire_risk: <Flame className="w-5 h-5 text-red-600" />,
  drill: <Bell className="w-5 h-5 text-blue-600" />,
  power_outage: <Zap className="w-5 h-5 text-yellow-600" />,
  lpg_safety: <Droplets className="w-5 h-5 text-orange-600" />,
  general: <Megaphone className="w-5 h-5 text-gray-600" />,
};

const TYPE_COLORS: Record<string, string> = {
  fire_risk: 'border-l-red-500 bg-red-50',
  drill: 'border-l-blue-500 bg-blue-50',
  power_outage: 'border-l-yellow-500 bg-yellow-50',
  lpg_safety: 'border-l-orange-500 bg-orange-50',
  general: 'border-l-gray-500 bg-gray-50',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/alerts/active')
      .then((res) => setAlerts(res.data))
      .catch((err) => { console.error(err); alert('Failed to load alerts.'); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-800">Fire Safety Alerts & Advisories</h2>
      </div>
      <p className="text-gray-600 mb-6">Stay informed with the latest fire safety alerts from BFP Malvar.</p>

      {loading && <p>Loading alerts...</p>}

      {!loading && alerts.length === 0 && (
        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <p>No active alerts at this time.</p>
        </div>
      )}

      {!loading && alerts.map((a) => (
        <div key={a.id} className={`border-l-4 rounded-lg p-5 mb-4 ${TYPE_COLORS[a.type] || 'bg-gray-50 border-l-gray-400'}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {TYPE_ICONS[a.type] || <Megaphone className="w-5 h-5" />} {a.title}
            </h3>
            <span className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-700 mt-2">{a.message}</p>
          {a.targetBarangay && (
            <p className="text-xs text-gray-500 mt-2">📍 Target: {a.targetBarangay}</p>
          )}
        </div>
      ))}
    </div>
  );
}
