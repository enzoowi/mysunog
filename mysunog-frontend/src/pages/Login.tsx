import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShieldAlert, Flame, UserPlus, LogIn, Upload, CheckCircle } from 'lucide-react';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idProof, setIdProof] = useState<File | null>(null);
    const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isRegistering) {
                // Register flow
                if (!idProof) {
                    setError('Please upload a valid government ID for residency verification.');
                    setLoading(false);
                    return;
                }
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                formData.append('idFile', idProof);

                await api.post('/auth/register', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                // Show success message instead of auto-login
                setSuccessMsg('Registration successful! Please wait for a BFP Admin to verify your submitted ID. You will be able to log in once your account is approved.');
                setIsRegistering(false);
                setEmail('');
                setPassword('');
                setIdProof(null);
                setIdProofPreview(null);
            } else {
                // Login flow
                const res = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', res.data.access_token);
                // Check role to redirect appropriately
                const me = await api.get('/auth/me');
                if (me.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message;
            if (err.response?.status === 403 && msg && msg.includes('verified')) {
                setError('Your account is still pending verification by an administrator. Please check back later.');
            } else {
                setError(msg || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setIdProof(file);
        setIdProofPreview(URL.createObjectURL(file));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-slate-800 z-0">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-red-900 to-transparent"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl z-10 border border-gray-100 relative">
                <div className="flex flex-col items-center">
                    <div className="bg-orange-100 p-3 rounded-full mb-4">
                        <Flame className="w-10 h-10 text-orange-600" />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        {isRegistering ? 'Create an Account' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isRegistering ? 'Register to access mySunog services.' : 'Sign in to access your dashboard.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700 font-medium">{successMsg}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        {isRegistering && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Government ID (Proof of Malvar Residency) <span className="text-red-500">*</span>
                                </label>
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition min-h-[120px]">
                                    {idProofPreview ? (
                                        <img src={idProofPreview} alt="ID Preview" className="max-h-24 object-contain rounded-lg shadow-sm" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 text-center px-2">Upload a valid ID showing your address</p>
                                        </>
                                    )}
                                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isRegistering ? <><UserPlus className="w-4 h-4 mr-2" /> Register</> : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>)}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => window.location.href = `http://${window.location.hostname}:3000/auth/google`}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm">
                    <span className="text-gray-600">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    </span>{' '}
                    <button
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        className="font-bold text-orange-600 hover:text-orange-500 hover:underline transition-all"
                    >
                        {isRegistering ? 'Sign in instead' : 'Create an account'}
                    </button>
                </div>
            </div>
        </div>
    );
}