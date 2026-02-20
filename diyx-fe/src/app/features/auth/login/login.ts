import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, switchMap, tap, finalize, catchError, EMPTY } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-blue-600">DIYX</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form [formGroup]="form" (ngSubmit)="submit$.next()" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                autocomplete="username"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                [class.border-red-500]="isInvalid('username')"
              />
              @if (isInvalid('username')) {
                <p class="text-red-500 text-xs mt-1">Username is required.</p>
              }
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                [class.border-red-500]="isInvalid('password')"
              />
              @if (isInvalid('password')) {
                <p class="text-red-500 text-xs mt-1">Password is required.</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-medium rounded-lg transition-colors"
            >
              {{ loading() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>
        </div>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?
          <a routerLink="/auth/register" class="text-blue-600 hover:underline font-medium">Register</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly submit$ = new Subject<void>();

  constructor() {
    this.submit$
      .pipe(
        tap(() => {
          this.form.markAllAsTouched();
        }),
        switchMap(() => {
          if (this.form.invalid) return EMPTY;
          this.loading.set(true);
          return this.auth.login(this.form.getRawValue()).pipe(
            finalize(() => this.loading.set(false)),
            catchError(() => EMPTY),
          );
        }),
      )
      .subscribe(() => this.router.navigate(['/portfolios']));
  }

  protected isInvalid(field: 'username' | 'password'): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }
}
