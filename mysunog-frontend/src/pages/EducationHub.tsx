import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BookOpen, ShieldCheck, Droplets, AlertTriangle, Home, BookMarked, Inbox } from 'lucide-react';

type Content = {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  general: <BookOpen className="w-5 h-5 text-blue-600" />,
  prevention: <ShieldCheck className="w-5 h-5 text-green-600" />,
  lpg: <Droplets className="w-5 h-5 text-orange-600" />,
  emergency: <AlertTriangle className="w-5 h-5 text-red-600" />,
  home_safety: <Home className="w-5 h-5 text-purple-600" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  prevention: 'Fire Prevention',
  lpg: 'LPG Safety',
  emergency: 'Emergency Preparedness',
  home_safety: 'Home Safety',
};

const BACKEND_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

export default function EducationHub() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await api.get('/site-images');
        const banner = res.data.find((img: any) => img.key === 'education_banner');
        if (banner?.imageUrl) setBannerUrl(`${BACKEND_URL}${banner.imageUrl}`);
      } catch {
        console.error('Failed to load education banner');
      }
    }
    fetchBanner();
  }, []);

  useEffect(() => {
    const params = selectedCategory ? `?category=${selectedCategory}` : '';
    api.get(`/education${params}`)
      .then((res) => setContents(res.data))
      .catch((err) => { console.error(err); alert('Failed to load education content.'); })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="w-full">
      {bannerUrl && (
        <div className="w-full h-48 md:h-64 mb-8 rounded-2xl overflow-hidden relative shadow-md">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img src={bannerUrl} alt="Education Hub Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center p-4">
            <BookMarked className="w-12 h-12 mb-2 drop-shadow-md" />
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-md mb-2">Fire Safety Education</h2>
            <p className="text-sm md:text-base font-medium drop-shadow-md">Learn how to stay safe and prevent fires in your community.</p>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        {!bannerUrl && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <BookMarked className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-800">Fire Safety Education Hub</h2>
            </div>
            <p className="text-gray-600 mb-6">Learn how to stay safe and prevent fires in your community.</p>
          </>
        )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${selectedCategory === key ? 'bg-orange-600 text-white [&>svg]:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {CATEGORY_ICONS[key]} {label}
          </button>
        ))}
      </div>

      {loading && <p>Loading content...</p>}

      {!loading && contents.length === 0 && (
        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
          <Inbox className="w-12 h-12 text-gray-300 mb-3" />
          <p>No education content available yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((c) => (
          <div key={c.id}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col"
            onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
              
            {c.imageUrl && (
              <div className="w-full h-40 overflow-hidden bg-gray-100">
                <img src={`${BACKEND_URL}${c.imageUrl}`} alt={c.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-50">
                {CATEGORY_ICONS[c.category] || <BookOpen className="w-4 h-4 text-blue-600" />}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{CATEGORY_LABELS[c.category] || c.category}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight">{c.title}</h3>
              <p className="text-sm text-gray-600 flex-1 relative">
                {expandedId === c.id ? c.content : c.content.substring(0, 120) + (c.content.length > 120 ? '...' : '')}
              </p>
              {c.content.length > 120 && (
                <div className="mt-3 text-orange-600 text-sm font-bold flex items-center gap-1">
                  {expandedId === c.id ? 'Show less' : 'Read more'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
