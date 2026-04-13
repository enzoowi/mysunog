import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type Inspection = {
  id: number;
  address: string;
  barangay: string;
  preferredDate: string;
  preferredTime: string;
  description?: string;
  status: string;
  adminNotes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  requestedBy?: { id: number; email: string };
};

export default function AdminInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});
  const [schedDateMap, setSchedDateMap] = useState<Record<number, string>>({});
  const [schedTimeMap, setSchedTimeMap] = useState<Record<number, string>>({});
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchInspections() {
    try {
      setLoading(true);
      const res = await api.get('/inspections');
      const data: Inspection[] = res.data;
      setInspections(data);
      const sMap: Record<number, string> = {};
      const nMap: Record<number, string> = {};
      const sdMap: Record<number, string> = {};
      const stMap: Record<number, string> = {};
      data.forEach((i) => {
        sMap[i.id] = i.status;
        nMap[i.id] = i.adminNotes || '';
        sdMap[i.id] = i.scheduledDate || '';
        stMap[i.id] = i.scheduledTime || '';
      });
      setStatusMap(sMap);
      setNotesMap(nMap);
      setSchedDateMap(sdMap);
      setSchedTimeMap(stMap);
    } catch (err) {
      console.error(err);
      alert('Failed to load inspections.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInspections(); }, []);

  async function handleUpdate(id: number) {
    try {
      setUpdatingId(id);
      await api.patch(`/inspections/${id}/status`, {
        status: statusMap[id],
        adminNotes: notesMap[id],
        scheduledDate: schedDateMap[id] || undefined,
        scheduledTime: schedTimeMap[id] || undefined,
      });
      alert(`Inspection #${id} updated.`);
      fetchInspections();
    } catch (err) {
      console.error(err);
      alert('Failed to update.');
    } finally {
      setUpdatingId(null);
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Inspection Management</h2>
      <p className="text-gray-600 mb-4">Review and manage fire safety inspection requests.</p>

      <button onClick={fetchInspections} className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Refresh</button>

      {loading && <p>Loading...</p>}

      {!loading && inspections.length === 0 && <p className="text-gray-500">No inspection requests found.</p>}

      {!loading && inspections.map((ins) => (
        <div key={ins.id} className="border border-gray-200 rounded-xl p-5 mb-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-lg">#{ins.id} — {ins.address}</p>
              <p className="text-sm text-gray-500">Barangay: {ins.barangay} | Requested by: {ins.requestedBy?.email || 'N/A'}</p>
              <p className="text-sm text-gray-500">Preferred: {ins.preferredDate} at {ins.preferredTime}</p>
              {ins.description && <p className="text-sm text-gray-600 mt-1">{ins.description}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ins.status] || 'bg-gray-100'}`}>
              {ins.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={statusMap[ins.id] || ''} onChange={(e) => setStatusMap((p) => ({ ...p, [ins.id]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
              <input type="text" value={notesMap[ins.id] || ''} onChange={(e) => setNotesMap((p) => ({ ...p, [ins.id]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <input type="date" value={schedDateMap[ins.id] || ''} onChange={(e) => setSchedDateMap((p) => ({ ...p, [ins.id]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
              <input type="time" value={schedTimeMap[ins.id] || ''} onChange={(e) => setSchedTimeMap((p) => ({ ...p, [ins.id]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <button onClick={() => handleUpdate(ins.id)} disabled={updatingId === ins.id}
            className="mt-3 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 text-sm font-medium">
            {updatingId === ins.id ? 'Updating...' : 'Update'}
          </button>
        </div>
      ))}
    </div>
  );
}
