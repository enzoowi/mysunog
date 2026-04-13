import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

type Hotline = { id: number; name: string; phone: string; category: string; };

const CATEGORIES = [
  { value: 'bfp', label: 'Bureau of Fire Protection' },
  { value: 'mdrrmo', label: 'MDRRMO' },
  { value: 'barangay', label: 'Barangay Hotlines' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'police', label: 'Police' },
  { value: 'general', label: 'Other Emergency Numbers' },
];

const empty = { name: '', phone: '', category: 'bfp' };

export default function AdminHotlines() {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchHotlines() {
    try {
      setLoading(true);
      const res = await api.get('/hotlines');
      setHotlines(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchHotlines(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/hotlines/${editingId}`, form);
      } else {
        await api.post('/hotlines', form);
      }
      setForm(empty);
      setEditingId(null);
      await fetchHotlines();
    } catch (err) { console.error(err); alert('Failed to save hotline.'); }
    finally { setSaving(false); }
  }

  function startEdit(h: Hotline) {
    setEditingId(h.id);
    setForm({ name: h.name, phone: h.phone, category: h.category });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this hotline?')) return;
    try {
      await api.delete(`/hotlines/${id}`);
      await fetchHotlines();
    } catch (err) { console.error(err); alert('Failed to delete.'); }
  }

  const grouped = hotlines.reduce<Record<string, Hotline[]>>((acc, h) => {
    if (!acc[h.category]) acc[h.category] = [];
    acc[h.category].push(h);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Manage Emergency Hotlines</h2>
      <p className="text-gray-500 text-sm mb-6">Add, edit, or remove hotlines shown on the public Emergency Hotlines page.</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 mb-6 space-y-3 shadow-sm">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Plus className="w-4 h-4 text-orange-500" />
          {editingId ? 'Edit Hotline' : 'Add New Hotline'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" placeholder="Name (e.g. BFP Malvar)" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm" required />
          <input type="text" placeholder="Phone number" value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm" required />
          <select value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50">
            <Check className="w-4 h-4" /> {saving ? 'Saving...' : editingId ? 'Update' : 'Add Hotline'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {!loading && hotlines.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8 border rounded-xl">No hotlines added yet.</p>
      )}

      {Object.entries(grouped).map(([category, items]) => {
        const catLabel = CATEGORIES.find(c => c.value === category)?.label ?? category;
        return (
          <div key={category} className="mb-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{catLabel}</h3>
            <div className="space-y-2">
              {items.map(h => (
                <div key={h.id} className={`flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm transition
                  ${editingId === h.id ? 'border-orange-400 bg-orange-50' : ''}`}>
                  <div>
                    <p className="font-medium text-gray-800">{h.name}</p>
                    <p className="text-sm text-gray-500">{h.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(h)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(h.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
