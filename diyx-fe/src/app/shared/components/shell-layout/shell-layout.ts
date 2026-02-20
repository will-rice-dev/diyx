import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../models/settings.model';

@Component({
  selector: 'app-shell-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-8">
            <a routerLink="/portfolios" class="text-xl font-bold text-blue-600 dark:text-blue-400">
              DIYX
            </a>
            <div class="flex items-center gap-1">
              <a
                routerLink="/portfolios"
                routerLinkActive="bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Portfolios
              </a>
              <a
                routerLink="/settings"
                routerLinkActive="bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Settings
              </a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              (click)="themeService.toggle()"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              {{ isDark() ? '☀️' : '🌙' }}
            </button>

            @if (auth.currentUser(); as user) {
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ user.username }}</span>
            }

            <button
              (click)="auth.logout()"
              class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400
                     hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellLayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  protected isDark = () => this.themeService.theme() === Theme.DARK;
}
