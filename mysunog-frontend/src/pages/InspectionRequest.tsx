import { useState } from 'react';
import { api } from '../services/api';

const BARANGAYS = [
  'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
  'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
  'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

export default function InspectionRequest() {
  const [form, setForm] = useState({
    address: '',
    barangay: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.address || !form.barangay || !form.preferredDate || !form.preferredTime) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/inspections', form);
      alert('Inspection request submitted successfully!');
      setForm({ address: '', barangay: '', preferredDate: '', preferredTime: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit inspection request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Fire Safety Inspection</h2>
      <p className="text-gray-600 mb-6">Fill out the form below to schedule a fire safety inspection.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input type="text" name="address" value={form.address} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter full address" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
          <select name="barangay" value={form.barangay} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Select Barangay</option>
            {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
            <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
            <input type="time" name="preferredTime" value={form.preferredTime} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Describe the purpose or any special requirements" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Inspection Request'}
        </button>
      </form>
    </div>
  );
}
