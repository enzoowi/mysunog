import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Chatbot from '../pages/Chatbot';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
            {/* Chat popover */}
            {isOpen && (
                <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right"
                    style={{ width: '350px', height: '500px', maxWidth: 'calc(100vw - 32px)' }}>
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {/* The Chatbot component is now fully responsive and handles its own layout */}
                    <Chatbot />
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${isOpen ? 'bg-gray-800 text-white w-12 h-12' : 'bg-orange-600 text-white w-14 h-14 hover:bg-orange-700'
                    }`}
                aria-label="Toggle Chat"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
            </button>
        </div>
    );
}
