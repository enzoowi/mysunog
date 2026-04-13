import { useState } from 'react';
import { api } from '../services/api';

const BARANGAYS = [
  'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
  'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
  'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

export default function HazardReport() {
  const [form, setForm] = useState({
    description: '', location: '', barangay: '', type: 'other'
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 8)); // Limit to 8 files
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description || !form.location || !form.barangay) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('barangay', form.barangay);
      formData.append('type', form.type);
      files.forEach((file) => {
        formData.append('files', file);
      });

      await api.post('/hazards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Hazard report submitted! Thank you for helping keep our community safe.');
      setForm({ description: '', location: '', barangay: '', type: 'other' });
      setFiles([]);
      // Reset file input visually
      const fileInput = document.getElementById('hazard-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message || error);
      alert(`Failed to submit hazard report: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">⚠️ Report a Fire Hazard</h2>
      <p className="text-gray-600 mb-6">Help keep your community safe by reporting fire hazards to BFP Malvar.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Type *</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500">
            <option value="illegal_wiring">Illegal Wiring</option>
            <option value="blocked_exit">Blocked Fire Exit</option>
            <option value="flammable_storage">Improper Flammable Storage</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            placeholder="Describe the hazard in detail" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input type="text" name="location" value={form.location} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
            placeholder="Street address or landmark" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
          <select name="barangay" value={form.barangay} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500">
            <option value="">Select Barangay</option>
            {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos & Videos (optional, up to 8 files)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition cursor-pointer" onClick={() => document.getElementById('hazard-file-input')?.click()}>
            <p className="text-sm text-gray-500 mb-2">Click or drag files here to upload</p>
            <input type="file" id="hazard-file-input" name="files" accept="image/*,video/*" multiple onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file, idx) => {
                const isVideo = file.type.startsWith('video/');
                return (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border">
                    {isVideo ? (
                      <video src={URL.createObjectURL(file)} className="w-full h-24 object-cover" />
                    ) : (
                      <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover" />
                    )}
                    <button type="button" onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Hazard Report'}
        </button>
      </form>
    </div>
  );
}
