const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
        throw new Error('No active session found');
    }
    
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }

    return response.json();
}

export async function register(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
}


export async function createProject(problemStatement: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ problem_statement: problemStatement }),
    });

    if (!response.ok) {
        throw new Error('Failed to create project');
    }

    return response.json();
}

export async function getRecentProjects(limit: number = 10) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects?limit=${limit}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch recent projects');
    }

    return response.json();
}

export async function getProject(projectId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to get project ${projectId}`);
    }

    return response.json();
}

export async function runPhase(projectId: string, phaseName: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/run-phase/${phaseName}`, {
        method: 'POST',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to run phase ${phaseName}`);
    }

    return response.json();
}

export async function getPhase(projectId: string, phaseName: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/phase/${phaseName}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        if (response.status === 404) return null; // Phase might not exist yet
        throw new Error(`Failed to get phase ${phaseName}`);
    }

    return response.json();
}

export async function updatePhase(projectId: string, phaseName: string, humanApprovedData: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/phase/${phaseName}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ human_approved_data: humanApprovedData }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update phase ${phaseName}`);
    }

    return response.json();
}
