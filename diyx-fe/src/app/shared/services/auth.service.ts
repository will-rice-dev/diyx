import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, UserResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'diyx_token';
const USER_KEY = 'diyx_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser$ = new BehaviorSubject<UserResponse | null>(this.loadUser());
  readonly currentUser$ = this._currentUser$.asObservable();
  readonly currentUser = signal<UserResponse | null>(this.loadUser());

  readonly isAuthenticated$ = this.currentUser$.pipe(
    // imported inline to avoid circular dependency with map
  );

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  login(body: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/api/auth/login`, body).pipe(
      tap((user) => this.setUser(user)),
    );
  }

  register(body: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/api/auth/register`, body).pipe(
      tap((user) => this.setUser(user)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser$.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setUser(user: UserResponse): void {
    localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser$.next(user);
    this.currentUser.set(user);
  }

  private loadUser(): UserResponse | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserResponse) : null;
    } catch {
      return null;
    }
  }
}
