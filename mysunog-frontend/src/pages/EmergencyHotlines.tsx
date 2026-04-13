import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Flame, Hospital, Home, Stethoscope, Shield, Phone, Inbox, PhoneCall, Copy, Check } from 'lucide-react';

type Hotline = { id: number; name: string; phone: string; category: string; };

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bfp: <Flame className="w-5 h-5 text-red-600" />,
  mdrrmo: <Hospital className="w-5 h-5 text-orange-600" />,
  barangay: <Home className="w-5 h-5 text-blue-600" />,
  hospital: <Stethoscope className="w-5 h-5 text-green-600" />,
  police: <Shield className="w-5 h-5 text-indigo-600" />,
  general: <Phone className="w-5 h-5 text-gray-600" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  bfp: 'Bureau of Fire Protection',
  mdrrmo: 'MDRRMO',
  barangay: 'Barangay Hotlines',
  hospital: 'Hospitals',
  police: 'Police',
  general: 'Other Emergency Numbers',
};

export default function EmergencyHotlines() {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  const handleCopy = (id: number | string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    api.get('/hotlines')
      .then((res) => setHotlines(res.data))
      .catch((err) => { console.error(err); })
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const grouped = hotlines.reduce<Record<string, Hotline[]>>((acc, h) => {
    const cat = h.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(h);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <PhoneCall className="w-8 h-8 text-red-700" />
        <h2 className="text-2xl font-bold text-gray-800">Emergency Hotline Directory</h2>
      </div>
      <p className="text-gray-600 mb-6">Quick access to emergency contacts in Malvar, Batangas.</p>

      {loading && <p>Loading...</p>}

      {!loading && hotlines.length === 0 && (
        <div className="text-center py-8 text-gray-400 flex flex-col items-center">
          <Inbox className="w-12 h-12 text-gray-300 mb-3" />
          <p>No hotlines available yet. Admin can add emergency contacts.</p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            {CATEGORY_ICONS[category] || <Phone className="w-5 h-5 text-gray-600" />} {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="space-y-2">
            {items.map((h) => (
              <div key={h.id} className="flex justify-between items-center bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition">
                <span className="font-medium text-gray-800">{h.name}</span>
                <button
                  onClick={() => handleCopy(h.id, h.phone)}
                  title="Copy number"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                >
                  {copiedId === h.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copiedId === h.id ? 'Copied' : h.phone}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5 text-center">
        <p className="font-bold text-red-700 text-lg">National Emergency Hotline</p>
        <button 
          onClick={() => handleCopy('national', '911')}
          title="Copy number"
          className="text-3xl font-bold text-red-600 hover:text-red-800 flex items-center justify-center gap-2 mx-auto mt-2 mb-1"
        >
          {copiedId === 'national' ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
          {copiedId === 'national' ? 'Copied' : '911'}
        </button>
        <p className="text-sm text-red-500 mt-1">For all emergencies — available 24/7</p>
      </div>
    </div>
  );
}
