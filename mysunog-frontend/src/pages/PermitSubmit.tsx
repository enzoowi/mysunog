import { useState } from 'react';
import { api } from '../services/api';

const BARANGAYS = [
  'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
  'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
  'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

export default function PermitSubmit() {
  const [form, setForm] = useState({
    businessName: '',
    businessAddress: '',
    barangay: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.businessAddress || !form.purpose) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/permits', {
        businessName: form.businessName,
        businessAddress: form.businessAddress,
        purpose: form.purpose,
      });
      alert('Permit submitted successfully!');
      setForm({ businessName: '', businessAddress: '', barangay: '', purpose: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit permit.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Apply for Fire Safety Permit</h2>
      <p className="text-gray-600 mb-6">Fill out the form below to submit a Fire Safety Inspection Certificate (FSIC) request.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
          <input type="text" name="businessName" value={form.businessName} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter business name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address *</label>
          <input type="text" name="businessAddress" value={form.businessAddress} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter full business address" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
          <select name="barangay" value={form.barangay} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Select Barangay</option>
            {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
          <textarea name="purpose" value={form.purpose} onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Describe the purpose of this permit application" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Permit Application'}
        </button>
      </form>
    </div>
  );
}