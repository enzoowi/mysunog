import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Alerts from './Alerts';
import EducationHub from './EducationHub';
import IncidentMap from './IncidentMap';
import EmergencyHotlines from './EmergencyHotlines';

const BACKEND_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

export default function Home() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await api.get('/site-images');
        const hero = res.data.find((img: any) => img.key === 'home_hero');
        if (hero?.imageUrl) setHeroImage(`${BACKEND_URL}${hero.imageUrl}`);
      } catch {
        console.error('Failed to load hero banner');
      }
    }
    fetchHero();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="bg-slate-800 text-white relative py-24 px-6 md:px-12 overflow-hidden"
        style={heroImage ? { 
          backgroundImage: `url(${heroImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        } : undefined}
      >
        {/* Abstract background graphics to mimic government agency feel */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-red-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight shadow-sm text-white">Bureau of Fire Protection - Malvar</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
                Protecting lives and properties. Empowering the community with real-time fire safety management, reporting, and hazard prevention.
            </p>
            <div className="mt-8 flex gap-4">
                <a href="#hotlines" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200">
                    Emergency Hotlines
                </a>
                <a href="#alerts" className="bg-white text-slate-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200">
                    Latest Alerts
                </a>
            </div>
        </div>
      </section>

      <div className="flex-1 w-full flex flex-col items-center">
          {/* Alerts Section */}
          <section id="alerts" className="w-full py-16 scroll-mt-16 bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <Alerts />
              </div>
          </section>

          {/* Education Hub Section */}
          <section id="education" className="w-full py-16 scroll-mt-16 bg-slate-50 border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <EducationHub />
              </div>
          </section>

          {/* Map Section */}
          <section id="map" className="w-full py-16 scroll-mt-16 bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="text-center mb-10">
                      <h2 className="text-3xl font-bold text-gray-800 mb-3">Interactive Incident Map</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">Monitor recent active fire incidents, safe zones, hydrants, and risk hotspots in the municipality of Malvar.</p>
                  </div>
                  <IncidentMap />
              </div>
          </section>

          {/* Hotlines Section */}
          <section id="hotlines" className="w-full py-16 scroll-mt-16 bg-slate-50 border-white">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <EmergencyHotlines />
              </div>
          </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 text-center text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="font-bold text-lg text-white tracking-wide">mySunog</span>
              </div>
              <p>© {new Date().getFullYear()} Bureau of Fire Protection - Malvar. All Rights Reserved.</p>
              <p className="mt-2 text-slate-500 text-xs">A unified command and digital modernization initiative.</p>
          </div>
      </footer>
    </div>
  );
}
