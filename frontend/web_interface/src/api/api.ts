const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface RegisterData {
    email: string;
    password: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token?: string;
    user?: {
      id: string;
      login: string;
    };
    message?: string;
  }

export const uploadCSVFile = async (file: File, targetR2?: number) => {
    const formData = new FormData();
    formData.append('file', file);

    if (targetR2 !== undefined) {
      formData.append('target_r2', String(targetR2));
    }

    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/run`, {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        body: formData,
    })
    
    if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
        }
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    return response.json();
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  target_r2: number;
  r2_score: number;
  status: string;
  created_at: string;
}

export const getHistory = async (): Promise<UploadHistoryItem[]> => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    throw new Error(`History fetch failed: ${response.statusText}`);
  }

  return response.json();
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
    }
  
    return response.json();
  };
  
  // Авторизация
  export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Login failed: ${response.statusText}`);
    }
  
    return response.json();
  };

