// Use a same-origin Next.js rewrite instead of cross-site cookies.
export const apiFetch = async (endpoint, options = {}) => {
    if (!endpoint.startsWith('/api/')) {
        throw new Error('Only backend /api routes are supported.');
    }
    return fetch(`/backend-api${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
};

// Health data in localStorage is a browser cache, not an authentication session.
// Clear it on account switches and sign-out to avoid sharing it on one device.
export const clearPrivateLocalData = () => {
    if (typeof window === 'undefined') return;
    const exactKeys = new Set([
        'user', 'userToken', 'waterCount', 'daily_step_goal',
        'daily_water_goal', 'mental_journal_entries', 'emotion_chat_history',
        'e_motion_goals', 'google_access_token'
    ]);
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('user_') || exactKeys.has(key)) {
            localStorage.removeItem(key);
        }
    });
};
