import { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BARANGAYS = [
    'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
    'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
    'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

export default function IncidentCreate() {
    const [form, setForm] = useState({
        incidentDate: '', incidentTime: '', barangay: '', cause: '',
        latitude: '', longitude: '', estimatedDamage: '', casualties: '',
        injuries: '', propertyType: '', remarks: '',
        alarmTime: '', responseTime: '', controlTime: '', fireOutTime: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/incidents', {
                ...form,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
                estimatedDamage: form.estimatedDamage ? Number(form.estimatedDamage) : undefined,
                casualties: form.casualties ? Number(form.casualties) : undefined,
                injuries: form.injuries ? Number(form.injuries) : undefined,
                alarmTime: form.alarmTime || undefined,
                responseTime: form.responseTime || undefined,
                controlTime: form.controlTime || undefined,
                fireOutTime: form.fireOutTime || undefined,
            });
            alert('Incident saved successfully.');
            setForm({
                incidentDate: '', incidentTime: '', barangay: '', cause: '',
                latitude: '', longitude: '', estimatedDamage: '', casualties: '',
                injuries: '', propertyType: '', remarks: '',
                alarmTime: '', responseTime: '', controlTime: '', fireOutTime: '',
            });
        } catch (error) {
            console.error(error);
            alert('Failed to save incident.');
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🔥 Record Fire Incident</h2>
            <p className="text-gray-600 mb-6">Fill in the details of the fire incident for BFP records.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                        <input type="time" name="incidentTime" value={form.incidentTime} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
                    <select name="barangay" value={form.barangay} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2" required>
                        <option value="">Select Barangay</option>
                        {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
                    <input type="text" name="cause" placeholder="e.g. Electrical, Cooking, Arson" value={form.cause} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                        <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                        <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Est. Damage (₱)</label>
                        <input type="number" name="estimatedDamage" value={form.estimatedDamage} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Casualties</label>
                        <input type="number" name="casualties" value={form.casualties} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Injuries</label>
                        <input type="number" name="injuries" value={form.injuries} onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <input type="text" name="propertyType" placeholder="e.g. Residential, Commercial" value={form.propertyType} onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2" />
                </div>

                <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">⏱️ Response Performance Data</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Alarm Time</label>
                            <input type="time" name="alarmTime" value={form.alarmTime} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Response Time</label>
                            <input type="time" name="responseTime" value={form.responseTime} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Control Time</label>
                            <input type="time" name="controlTime" value={form.controlTime} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Fire Out Time</label>
                            <input type="time" name="fireOutTime" value={form.fireOutTime} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea name="remarks" placeholder="Additional details..." value={form.remarks} onChange={handleChange} rows={3}
                        className="w-full border rounded-lg px-4 py-2" />
                </div>

                <button type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    Save Incident
                </button>
            </form>
        </div>
    );
}