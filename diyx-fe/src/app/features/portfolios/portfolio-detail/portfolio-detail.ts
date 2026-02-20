import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Subject } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioResponse } from '../../../shared/models/portfolio.model';

@Component({
  selector: 'app-portfolio-detail',
  imports: [DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <a routerLink="/portfolios" class="hover:text-blue-600 transition-colors">Portfolios</a>
        <span>/</span>
        <span class="text-gray-900 dark:text-gray-100">{{ portfolio()?.name ?? 'Loading…' }}</span>
      </div>

      @if (portfolio(); as p) {
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">{{ p.name }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Created {{ p.createdAt | date: 'MMM d, y' }} ·
              Updated {{ p.updatedAt | date: 'MMM d, y' }}
            </p>
          </div>
          <a
            [routerLink]="['/portfolios', p.id, 'edit']"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Edit
          </a>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="font-semibold">Holdings</h2>
          </div>

          @if (stockEntries(p).length === 0) {
            <div class="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No stocks in this portfolio.
            </div>
          } @else {
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th class="px-5 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Ticker</th>
                  <th class="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Shares</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (entry of stockEntries(p); track entry.key) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-5 py-3 font-mono font-semibold tracking-wide uppercase">{{ entry.key }}</td>
                    <td class="px-5 py-3 text-right">{{ entry.value | number: '1.2-4' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      } @else if (error()) {
        <div class="text-center py-16">
          <p class="text-red-600 dark:text-red-400 mb-4">Failed to load portfolio.</p>
          <a routerLink="/portfolios" class="text-blue-600 hover:underline">Back to portfolios</a>
        </div>
      } @else {
        <div class="flex justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    </div>
  `,
})
export class PortfolioDetailComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  @Input() id!: string;

  protected readonly portfolio = signal<PortfolioResponse | null>(null);
  protected readonly error = signal(false);

  private readonly load$ = new Subject<number>();

  constructor() {
    this.load$
      .pipe(switchMap((id) => this.portfolioService.getById(id)))
      .subscribe({
        next: (p) => this.portfolio.set(p),
        error: () => this.error.set(true),
      });
  }

  ngOnInit(): void {
    this.load$.next(Number(this.id));
  }

  protected stockEntries(p: PortfolioResponse): { key: string; value: number }[] {
    return Object.entries(p.stocks).map(([key, value]) => ({ key, value }));
  }
}
