const BASE_URL = 'http://localhost:8000/api/v1';

async function fetchWithRole(endpoint: string, options: RequestInit = {}) {
  let role = 'guest';
  if (typeof window !== 'undefined') {
    role = localStorage.getItem('maha_role') || 'guest';
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Demo-Role': role,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchWithRole(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data: any, options?: RequestInit) => fetchWithRole(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any, options?: RequestInit) => fetchWithRole(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) => fetchWithRole(endpoint, { ...options, method: 'DELETE' }),
};
