export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    companyId?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}
