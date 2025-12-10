import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  __v?: number;
}

export interface LoginResponse {
  msg: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuthData();
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    console.log('API URL:', `${environment.apiUrl}/login`);
    console.log('Login data:', loginData);

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginData)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          this.setAuthData(response.token, response.user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login API error:', error);
          console.error('Error response body:', error.error);
          return throwError(() => error);
        })
      );
  }

  setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user ? user.isAdmin : false;
  }

  logout(): void {
   localStorage.clear();
    this.currentUserSubject.next(null);

  }

  private loadStoredAuthData(): void {
    const user = this.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }
  getUserName(): any {
    const token = this.getToken();
    if (token) {
      const user = this.getUser();
      return user?.name;
    }
    return null;
  }

  createregisterUser(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }
}
