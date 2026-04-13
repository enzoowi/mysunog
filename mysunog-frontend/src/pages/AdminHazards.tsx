import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

type Hazard = {
  id: number; description: string; location: string; barangay: string;
  type: string; status: string; imageUrls?: string[]; videoUrls?: string[]; adminNotes?: string;
  createdAt: string; reportedBy?: { id: number; email: string };
};

export default function AdminHazards() {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  // Close lightbox on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
    }
    if (lightboxUrl) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxUrl, closeLightbox]);

  async function fetchHazards() {
    try {
      setLoading(true);
      const res = await api.get('/hazards');
      const data: Hazard[] = res.data;
      setHazards(data);
      const sm: Record<number, string> = {};
      const nm: Record<number, string> = {};
      data.forEach((h) => { sm[h.id] = h.status; nm[h.id] = h.adminNotes || ''; });
      setStatusMap(sm);
      setNotesMap(nm);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchHazards(); }, []);

  async function handleUpdate(id: number) {
    try {
      await api.patch(`/hazards/${id}/status`, { status: statusMap[id], adminNotes: notesMap[id] });
      alert(`Hazard #${id} updated.`);
      fetchHazards();
    } catch (err) { console.error(err); alert('Failed to update.'); }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  const typeLabels: Record<string, string> = {
    illegal_wiring: '⚡ Illegal Wiring',
    blocked_exit: '🚪 Blocked Exit',
    flammable_storage: '🔥 Flammable Storage',
    other: '⚠️ Other',
  };

  return (
    <div className="p-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hazard Reports Review</h2>

      <button onClick={fetchHazards} className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Refresh</button>

      {loading && <p>Loading...</p>}
      {!loading && hazards.length === 0 && <p className="text-gray-500">No hazard reports.</p>}

      {!loading && hazards.map((h) => (
        <div key={h.id} className="border rounded-xl p-5 mb-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{typeLabels[h.type] || h.type}</p>
              <p className="text-sm text-gray-500">{h.location}, {h.barangay}</p>
              <p className="text-sm text-gray-500">By: {h.reportedBy?.email || 'N/A'} | {new Date(h.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[h.status] || 'bg-gray-100'}`}>
              {h.status}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{h.description}</p>
          
          <div className="flex flex-col gap-2 mb-3">
            {h.imageUrls && h.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {h.imageUrls.map((url, i) => (
                  <button key={i} onClick={() => setLightboxUrl(`${BACKEND_URL}${url}`)} className="block relative group cursor-pointer">
                    <img src={`${BACKEND_URL}${url}`} alt="Hazard" className="w-20 h-20 object-cover rounded-lg border hover:opacity-80 transition" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-semibold drop-shadow-md">View</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {h.videoUrls && h.videoUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {h.videoUrls.map((url, i) => (
                  <video key={i} src={`${BACKEND_URL}${url}`} controls 
                    className="h-32 rounded-lg border bg-black object-contain" />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <select value={statusMap[h.id] || ''} onChange={(e) => setStatusMap((p) => ({ ...p, [h.id]: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
            <input type="text" value={notesMap[h.id] || ''} onChange={(e) => setNotesMap((p) => ({ ...p, [h.id]: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm" placeholder="Admin notes..." />
          </div>
          <button onClick={() => handleUpdate(h.id)}
            className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">Update</button>
        </div>
      ))}

      {/* Lightbox Overlay */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition text-white"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="Hazard full view"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
