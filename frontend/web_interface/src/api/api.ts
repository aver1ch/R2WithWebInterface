const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export interface RegisterData {
    login: string;
    password: string;
  }
  
  export interface LoginData {
    login: string;
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

export const uploadCSVFile = async (file: File) => { // Выход на бэк для загрузки файла
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/upload`, { 
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

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => { // Выход на бэк для регистрации
    const response = await fetch(`${API_BASE_URL}/api/register`, {
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
  export const loginUser = async (data: LoginData): Promise<AuthResponse> => { // Выход на бэк для логина
    const response = await fetch(`${API_BASE_URL}/api/login`, {
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

