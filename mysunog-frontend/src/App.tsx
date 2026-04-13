import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './services/api';
import { Flame, ChevronDown, Bell, LogOut, User } from 'lucide-react';

import Home from './pages/Home';
import ChatbotWidget from './components/ChatbotWidget';

import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import PermitSubmit from './pages/PermitSubmit';
import MyPermits from './pages/MyPermits';
import AdminPermits from './pages/AdminPermits';
import Notifications from './pages/Notifications';
import IncidentCreate from './pages/IncidentCreate';
import IncidentList from './pages/IncidentList';
import IncidentDashboard from './pages/IncidentDashboard';
import IncidentMap from './pages/IncidentMap';
import InspectionRequest from './pages/InspectionRequest';
import AdminInspections from './pages/AdminInspections';
import AdminAlerts from './pages/AdminAlerts';
import AdminEducation from './pages/AdminEducation';
import HazardReport from './pages/HazardReport';
import AdminHazards from './pages/AdminHazards';
import VolunteerRegister from './pages/VolunteerRegister';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';
import VerifyId from './pages/VerifyId';
import AdminSiteImages from './pages/AdminSiteImages';
import AdminHotlines from './pages/AdminHotlines';
import AdminMapAssets from './pages/AdminMapAssets';
import AdminVerifications from './pages/AdminVerifications';

export default function App() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['alerts', 'education', 'map', 'hotlines'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on typical header heights
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
          }
        }
      }
      if (current !== activeTab) setActiveTab(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Scroll to hash when necessary
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
           const y = element.getBoundingClientRect().top + window.scrollY - 80;
           window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  const handleNavClick = (hash: string) => {
      setMenuOpen(false);
      setServicesOpen(false);
      if (location.pathname === '/') {
          const id = hash.replace('/#', '').replace('#', '');
          const element = document.getElementById(id);
          if (element) {
             // add a small offset so it doesn't get covered by the sticky navbar
             const y = element.getBoundingClientRect().top + window.scrollY - 80;
             window.scrollTo({ top: y, behavior: 'smooth' });
          }
      } else {
          navigate(hash);
      }
  };

  async function fetchUnreadCount() {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setUnreadCount(0); return; }
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch { setUnreadCount(0); }
  }

  async function fetchUserEmail() {
    try {
      const token = localStorage.getItem('token');
      if (!token) { 
        setUserEmail(null); 
        setUserRole(null);
        return; 
      }
      const res = await api.get('/auth/me');
      setUserEmail(res.data.email);
      setUserRole(res.data.role);
    } catch { 
      setUserEmail(null); 
      setUserRole(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUserEmail(null);
    setUserRole(null);
    setUnreadCount(0);
    navigate('/login');
  }

  useEffect(() => { fetchUnreadCount(); fetchUserEmail(); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-2 z-50">
              <Flame className="w-8 h-8 text-orange-600" />
              <span className="font-bold text-xl text-gray-800">mySunog</span>
            </Link>

            <div className={`${menuOpen ? 'block absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-4' : 'hidden'} md:flex md:items-center md:mx-auto`}>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                {/* Citizen Section */}
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-3 py-1 md:hidden">Citizen</span>
                <button onClick={() => handleNavClick('/#alerts')} className={`px-3 py-2 text-sm rounded-lg transition text-left font-medium ${activeTab === 'alerts' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>Alerts</button>
                <button onClick={() => handleNavClick('/#education')} className={`px-3 py-2 text-sm rounded-lg transition text-left font-medium ${activeTab === 'education' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>Education</button>
                <button onClick={() => handleNavClick('/#map')} className={`px-3 py-2 text-sm rounded-lg transition text-left font-medium ${activeTab === 'map' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>Map</button>
                <button onClick={() => handleNavClick('/#hotlines')} className={`px-3 py-2 text-sm rounded-lg transition text-left font-medium ${activeTab === 'hotlines' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>Hotlines</button>
                {userRole !== 'admin' && (
                  <Link to="/hazard-report" className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition font-medium" onClick={() => setMenuOpen(false)}>Report Hazard</Link>
                )}
                
                {/* Dropdown for Services */}
                {userEmail && userRole !== 'admin' && (
                  <div className="relative group" 
                       onMouseEnter={() => setServicesOpen(true)} 
                       onMouseLeave={() => setServicesOpen(false)}>
                      <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition w-full md:w-auto font-medium"
                              onClick={() => setServicesOpen(!servicesOpen)}>
                          Services <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu - pt-2 creates invisible hover bridge so mouse doesn't lose focus */}
                      <div className={`${servicesOpen ? 'block' : 'hidden'} md:absolute left-0 top-full w-48 z-[1001] ml-4 md:ml-0 md:pt-2`}>
                        <div className="bg-white md:shadow-xl md:border border-gray-100 rounded-xl overflow-hidden">
                          <Link to="/submit" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition" onClick={() => {setMenuOpen(false); setServicesOpen(false);}}>
                              <FileTextIcon /> 
                              <span className="ml-2">Apply for Permit</span>
                          </Link>
                          <Link to="/inspections/request" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition border-t border-gray-50" onClick={() => {setMenuOpen(false); setServicesOpen(false);}}>
                              <SettingsIcon />
                              <span className="ml-2">Request Inspection</span>
                          </Link>
                        </div>
                      </div>
                  </div>
                )}

                <div className="hidden md:block w-px h-6 bg-gray-200 mx-2" />

                {/* User Section */}
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-3 py-1 md:hidden mt-4">Account</span>
                {userEmail && userRole !== 'admin' && (
                  <Link to="/mine" className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition font-medium" onClick={() => setMenuOpen(false)}>My Permits</Link>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin/dashboard" className="px-3 py-2 text-sm text-orange-600 font-bold hover:bg-orange-50 rounded-lg transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                )}
                {!userEmail && (
                  <Link to="/login" className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                )}
                {userEmail && (
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium md:hidden flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                )}
              </div>
            </div>

            {/* Always visible top-right section */}
            <div className="flex items-center gap-2 ml-auto z-50">
              {userEmail && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700 max-w-[180px] truncate" title={userEmail}>{userEmail}</span>
                  </div>
                  <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
              <Link to="/notifications" className="p-2 relative text-gray-500 hover:text-orange-600 transition" title="Notifications" onClick={() => setMenuOpen(false)}>
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold px-1 border-2 border-white">{unreadCount}</span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
                <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <main className="max-w-7xl mx-auto flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          {/* Citizen routes */}
          <Route path="/submit" element={<PermitSubmit />} />
          <Route path="/mine" element={<MyPermits />} />
          <Route path="/inspections/request" element={<InspectionRequest />} />
          <Route path="/hazard-report" element={<HazardReport />} />
          <Route path="/volunteer" element={<VolunteerRegister />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Incident routes */}
          <Route path="/incidents/create" element={<IncidentCreate />} />
          <Route path="/incidents/list" element={<IncidentList />} />
          <Route path="/incidents/dashboard" element={<IncidentDashboard />} />
          <Route path="/incidents/map" element={<IncidentMap />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/permits" element={<AdminPermits />} />
          <Route path="/admin/inspections" element={<AdminInspections />} />
          <Route path="/admin/alerts" element={<AdminAlerts />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/hazards" element={<AdminHazards />} />
          <Route path="/admin/site-images" element={<AdminSiteImages />} />
          <Route path="/admin/hotlines" element={<AdminHotlines />} />
          <Route path="/admin/map-assets" element={<AdminMapAssets />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/reports" element={<Reports />} />

          {/* Verification Fallback */}
          <Route path="/verify-id" element={<VerifyId />} />
        </Routes>
      </main>

      {/* Floating Chatbot Widget Wrapper (rendered on all pages) */}
      <ChatbotWidget />
    </div>
  );
}

// Inline mini-icons for dropdown since they needed to be rendered neatly.
function FileTextIcon() { return <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>; }
function SettingsIcon() { return <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }