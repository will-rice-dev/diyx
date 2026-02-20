import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, skip, switchMap } from 'rxjs';
import { SettingsService } from '../services/settings.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { Theme } from '../../../shared/models/settings.model';
import { ToastService } from '../../../shared/components/toast/toast.service';

const TIMEZONES = Intl.supportedValuesOf('timeZone');

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <div class="max-w-2xl space-y-6">
      <h1 class="text-2xl font-bold">Settings</h1>

      @if (settingsService.settings$ | async; as settings) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Theme -->
          <div class="px-6 py-5 flex items-center justify-between">
            <div>
              <h2 class="font-semibold">Appearance</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Choose light or dark theme</p>
            </div>
            <button
              (click)="toggleTheme()"
              role="switch"
              [attr.aria-checked]="isDark()"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              [class]="isDark() ? 'bg-blue-600' : 'bg-gray-300'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                [class]="isDark() ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Timezone -->
          <form [formGroup]="form" class="px-6 py-5">
            <label for="timezone" class="block font-semibold mb-1">Timezone</label>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Used to display timestamps. Changes save automatically.
            </p>
            <select
              id="timezone"
              formControlName="timezone"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              @for (tz of timezones; track tz) {
                <option [value]="tz">{{ tz }}</option>
              }
            </select>
          </form>
        </div>
      } @else {
        <div class="flex justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    </div>
  `,
})
export class SettingsPageComponent implements OnInit {
  protected readonly settingsService = inject(SettingsService);
  private readonly themeService = inject(ThemeService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly timezones = TIMEZONES;

  protected readonly form = this.fb.nonNullable.group({
    timezone: [Intl.DateTimeFormat().resolvedOptions().timeZone],
  });

  protected isDark = () => this.themeService.theme() === Theme.DARK;

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings) => {
      this.themeService.syncFromApi(settings.theme);
      this.form.patchValue({ timezone: settings.timezone }, { emitEvent: false });
    });

    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(500),
        distinctUntilChanged((a, b) => a.timezone === b.timezone),
        switchMap(({ timezone }) =>
          this.settingsService.update({ timezone }),
        ),
      )
      .subscribe(() => this.toast.success('Settings saved.'));
  }

  protected toggleTheme(): void {
    const next = this.themeService.theme() === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    this.themeService.setTheme(next);
    this.settingsService.update({ theme: next }).subscribe(() => {
      this.toast.success('Theme updated.');
    });
  }
}
