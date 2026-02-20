import { inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Theme, UpdateSettingsRequest } from '../models/settings.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly http = inject(HttpClient);

  readonly theme = signal<Theme>(Theme.LIGHT);

  constructor() {
    effect(() => {
      const isDark = this.theme() === Theme.DARK;
      document.documentElement.classList.toggle('dark', isDark);
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggle(): void {
    this.setTheme(this.theme() === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  }

  syncFromApi(theme: Theme): void {
    this.theme.set(theme);
  }

  saveToApi(theme: Theme): void {
    const body: UpdateSettingsRequest = { theme };
    this.http.patch(`${environment.apiUrl}/api/users/me/settings`, body).subscribe();
  }
}
