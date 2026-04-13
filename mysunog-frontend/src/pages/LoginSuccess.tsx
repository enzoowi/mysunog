import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // Check user role to decide where to redirect
            fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.role === 'admin') {
                        navigate('/admin/dashboard', { replace: true });
                    } else {
                        navigate('/', { replace: true });
                    }
                })
                .catch(() => {
                    navigate('/', { replace: true });
                });
        } else {
            console.error('No token found in redirect');
            navigate('/login', { replace: true });
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800">Authenticating...</h2>
                <p className="text-sm text-gray-500 mt-2">Please wait while we log you in.</p>
            </div>
        </div>
    );
}
