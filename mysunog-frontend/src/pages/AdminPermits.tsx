import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, RefreshCw, Save, Building, MapPin } from 'lucide-react';

type PermitStatus =
    | 'submitted'
    | 'under_review'
    | 'revision_required'
    | 'approved'
    | 'released'
    | 'rejected';

type Permit = {
    id: number;
    businessName: string;
    businessAddress: string;
    purpose: string;
    status: PermitStatus;
    adminRemarks: string | null;
    createdAt: string;
    createdBy?: {
        id: number;
    };
};

export default function AdminPermits() {
    const [permits, setPermits] = useState<Permit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const [statusMap, setStatusMap] = useState<Record<number, PermitStatus>>({});
    const [remarksMap, setRemarksMap] = useState<Record<number, string>>({});

    async function fetchPermits() {
        try {
            setLoading(true);
            setError('');

            const res = await api.get('/permits');
            const data: Permit[] = res.data;

            setPermits(data);

            const initialStatusMap: Record<number, PermitStatus> = {};
            const initialRemarksMap: Record<number, string> = {};

            data.forEach((permit) => {
                initialStatusMap[permit.id] = permit.status;
                initialRemarksMap[permit.id] = permit.adminRemarks ?? '';
            });

            setStatusMap(initialStatusMap);
            setRemarksMap(initialRemarksMap);
        } catch (err) {
            console.error(err);
            setError('Failed to load permit requests.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPermits();
    }, []);

    async function handleUpdate(permitId: number) {
        try {
            setUpdatingId(permitId);

            await api.patch(`/permits/${permitId}/status`, {
                status: statusMap[permitId],
                adminRemarks: remarksMap[permitId],
            });

            alert(`Permit #${permitId} updated successfully.`);
            await fetchPermits();
        } catch (err) {
            console.error(err);
            alert('Failed to update permit status.');
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-4 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <FileText className="w-8 h-8 text-blue-700" />
                        <h2 className="text-2xl font-bold text-gray-800">Admin Permit Management</h2>
                    </div>
                    <p className="text-gray-600">Review, update, and manage citizen permit requests.</p>
                </div>
                <button
                    onClick={fetchPermits}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                    <RefreshCw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
                    Refresh List
                </button>
            </div>

            {loading && !permits.length && (
                <div className="text-center py-12 text-gray-500">Loading permit requests...</div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            {!loading && !error && permits.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-800">All caught up!</h3>
                    <p className="text-gray-500 text-sm">There are no permit requests at the moment.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {!error && permits.map((permit) => (
                    <div key={permit.id} className="bg-white border text-sm border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                        <div className="border-b bg-gray-50/50 px-5 py-3 flex justify-between items-center">
                            <span className="font-semibold text-gray-700 flex items-center gap-2">
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">#{permit.id}</span>
                                {new Date(permit.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                ${permit.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  permit.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  permit.status === 'released' ? 'bg-blue-100 text-blue-700' :
                                  permit.status === 'revision_required' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                {permit.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        <div className="p-5">
                            <div className="flex gap-2 items-start mb-3">
                                <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-800">{permit.businessName}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 items-start mb-3">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <p className="text-gray-600">{permit.businessAddress}</p>
                            </div>

                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Purpose of Permit</p>
                                <p className="text-gray-700">{permit.purpose}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Update Status</label>
                                    <select
                                        value={statusMap[permit.id] || permit.status}
                                        onChange={(e) => setStatusMap(prev => ({ ...prev, [permit.id]: e.target.value as PermitStatus }))}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm py-2 px-3 border"
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="revision_required">Revision Required</option>
                                        <option value="approved">Approved</option>
                                        <option value="released">Released</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Admin Remarks</label>
                                    <textarea
                                        value={remarksMap[permit.id] ?? ''}
                                        onChange={(e) => setRemarksMap(prev => ({ ...prev, [permit.id]: e.target.value }))}
                                        rows={3}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm py-2 px-3 border resize-none"
                                        placeholder="Add notes or requirements..."
                                    />
                                </div>

                                <button
                                    onClick={() => handleUpdate(permit.id)}
                                    disabled={updatingId === permit.id}
                                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {updatingId === permit.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {updatingId === permit.id ? 'Saving Changes...' : 'Save Updates'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}