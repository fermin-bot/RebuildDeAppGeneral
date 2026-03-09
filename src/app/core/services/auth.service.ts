import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'https://api.placeholder.com/v1'; // Placeholder URL
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check token validity on startup if needed
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // TODO: Replace with actual API call
    // return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
    
    // Mock implementation for demo
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      user: {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user',
        firstName: 'Demo',
        lastName: 'User'
      }
    };

    return of(mockResponse).pipe(
      delay(1000), // Simulate network delay
      tap(response => {
        this.saveSession(response);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: 'admin' | 'user'): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  private saveSession(response: AuthResponse): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
