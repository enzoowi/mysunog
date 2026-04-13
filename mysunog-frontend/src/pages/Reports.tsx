import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, AlertCircle, TrendingDown, X, Download } from 'lucide-react';
import { api } from '../services/api';

const BARANGAYS = [
  'All', 'Bagong Pook', 'Bilucao', 'Bulihan', 'Luta del Norte', 'Luta del Sur',
  'Poblacion', 'San Andres', 'San Fernando', 'San Isidro', 'San Juan',
  'San Pedro I', 'San Pedro II', 'San Pioquinto', 'Santiago',
];

export default function Reports() {
  const [barangay, setBarangay] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  function buildQuery() {
    const params = new URLSearchParams();
    if (barangay && barangay !== 'All') params.set('barangay', barangay);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return params.toString();
  }

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      try {
        const res = await api.get(`/incidents/search?${buildQuery()}`);
        setIncidents(res.data);
      } catch (e) {
        console.error('Failed to fetch incidents', e);
      } finally {
        setLoading(false);
      }
    }
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barangay, startDate, endDate]);

  function downloadPdf() {
    window.open(`http://localhost:3000/reports/incidents/pdf?${buildQuery()}`, '_blank');
  }

  function downloadExcel() {
    window.open(`http://localhost:3000/reports/incidents/excel?${buildQuery()}`, '_blank');
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Reports & Export</h2>
      <p className="text-gray-600 mb-6">Generate and download fire incident reports for administrative use.</p>

      {/* Filters & Export */}
      <div className="bg-white border text-sm rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Report Filters & Export</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Barangay</label>
            <select value={barangay} onChange={(e) => setBarangay(e.target.value)}
              className="w-full border-gray-300 border rounded-lg px-4 py-2.5 shadow-sm focus:ring-orange-500 focus:border-orange-500">
              {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 border rounded-lg px-4 py-2.5 shadow-sm focus:ring-orange-500 focus:border-orange-500" />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-gray-300 border rounded-lg px-4 py-2.5 shadow-sm focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={downloadPdf}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2">
            📊 Download Excel
          </button>
        </div>
      </div>

      {/* Incident Data Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Incident Records</h3>
            <span className="text-xs font-medium text-gray-500 bg-white border px-3 py-1 rounded-full">{incidents.length} Result{incidents.length !== 1 && 's'}</span>
        </div>
        
        {loading ? (
            <div className="p-12 text-center text-gray-500">Loading incidents...</div>
        ) : incidents.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No incidents found for the selected filters.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Date & Time</th>
                            <th className="px-6 py-3 font-semibold">Location</th>
                            <th className="px-6 py-3 font-semibold">Cause</th>
                            <th className="px-6 py-3 font-semibold">Damage / Victims</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {incidents.map((incident) => (
                            <tr key={incident.id} onClick={() => setSelectedIncident(incident)} className="hover:bg-orange-50/50 cursor-pointer transition">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{incident.incidentDate}</div>
                                    <div className="text-gray-500 flex items-center gap-1 mt-0.5 text-xs"><Clock className="w-3 h-3"/> {incident.incidentTime}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium flex items-center gap-1 text-gray-800"><MapPin className="w-3.5 h-3.5 text-red-500" /> {incident.barangay}</div>
                                    <div className="text-gray-500 text-xs ml-4.5 mt-0.5">{incident.propertyType || '-'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-medium">
                                        <AlertCircle className="w-3 h-3" />
                                        {incident.cause || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium flex items-center gap-1 text-orange-600"><TrendingDown className="w-3.5 h-3.5" /> ₱{(incident.estimatedDamage || 0).toLocaleString()}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">
                                        Casualties: {incident.casualties || 0} | Injuries: {incident.injuries || 0}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Incident #{selectedIncident.id} Details
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Date & Time</p>
                  <p className="font-medium text-gray-800">{selectedIncident.incidentDate} at {selectedIncident.incidentTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Barangay</p>
                  <p className="font-medium text-gray-800">{selectedIncident.barangay}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Cause of Fire</p>
                  <p className="font-medium text-gray-800">{selectedIncident.cause || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Property Type</p>
                  <p className="font-medium text-gray-800">{selectedIncident.propertyType || 'N/A'}</p>
                </div>
                
                <div className="col-span-2 border-t pt-4 mt-2"></div>
                
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Estimated Damage</p>
                  <p className="font-bold text-red-600">₱{(selectedIncident.estimatedDamage || 0).toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Victims</p>
                   <p className="font-medium text-gray-800">{selectedIncident.casualties || 0} Casualties, {selectedIncident.injuries || 0} Injuries</p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Location Coordinates</p>
                  <p className="font-medium text-gray-800">{selectedIncident.latitude}, {selectedIncident.longitude}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Remarks</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[60px] text-gray-700">
                    {selectedIncident.remarks || 'No remarks provided.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => window.open(`http://localhost:3000/reports/incidents/${selectedIncident.id}/pdf`, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Incident PDF
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
