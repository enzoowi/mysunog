import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BARANGAYS = [
  'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
  'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
  'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

type AlertItem = {
  id: number; title: string; message: string; type: string;
  targetBarangay?: string; isActive: boolean; createdAt: string;
};

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', message: '', type: 'general', targetBarangay: '' });

  async function fetchAlerts() {
    try {
      setLoading(true);
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchAlerts(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/alerts', {
        ...form,
        targetBarangay: form.targetBarangay || undefined,
      });
      alert('Alert created!');
      setForm({ title: '', message: '', type: 'general', targetBarangay: '' });
      fetchAlerts();
    } catch (err) { console.error(err); alert('Failed to create alert.'); }
  }

  async function toggleActive(id: number, isActive: boolean) {
    await api.patch(`/alerts/${id}`, { isActive: !isActive });
    fetchAlerts();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this alert?')) return;
    await api.delete(`/alerts/${id}`);
    fetchAlerts();
  }

  return (
    <div className="p-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Alerts & Advisories</h2>

      <form onSubmit={handleCreate} className="bg-white border rounded-xl p-5 mb-6 space-y-3">
        <h3 className="font-semibold text-lg">Create New Alert</h3>
        <input type="text" placeholder="Title" value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="w-full border rounded-lg px-4 py-2" required />
        <textarea placeholder="Message" value={form.message} rows={3}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="w-full border rounded-lg px-4 py-2" required />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className="border rounded-lg px-4 py-2">
            <option value="general">General</option>
            <option value="fire_risk">Fire Risk</option>
            <option value="drill">Fire Drill</option>
            <option value="power_outage">Power Outage</option>
            <option value="lpg_safety">LPG Safety</option>
          </select>
          <select value={form.targetBarangay} onChange={(e) => setForm((p) => ({ ...p, targetBarangay: e.target.value }))}
            className="border rounded-lg px-4 py-2">
            <option value="">All Barangays</option>
            {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-medium">
          Publish Alert
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && alerts.map((a) => (
        <div key={a.id} className={`border rounded-xl p-4 mb-3 flex justify-between items-center ${a.isActive ? 'bg-white' : 'bg-gray-100 opacity-60'}`}>
          <div>
            <p className="font-semibold">{a.title} <span className="text-xs text-gray-400">({a.type})</span></p>
            <p className="text-sm text-gray-600">{a.message.substring(0, 100)}{a.message.length > 100 ? '...' : ''}</p>
            {a.targetBarangay && <p className="text-xs text-gray-400">Target: {a.targetBarangay}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleActive(a.id, a.isActive)}
              className={`px-3 py-1 rounded text-xs font-medium ${a.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {a.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => handleDelete(a.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
