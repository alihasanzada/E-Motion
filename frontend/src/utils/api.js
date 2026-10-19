export const apiFetch = async (endpoint, options = {}) => {
    let API_BASE_URL = 'https://e-motion-7vds.onrender.com';

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            API_BASE_URL = 'http://localhost:5050';
        }
    }

    const defaultOptions = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    return response;
};