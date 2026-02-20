import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioResponse } from '../../../shared/models/portfolio.model';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-portfolio-list',
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Portfolios</h1>
        <a
          routerLink="/portfolios/new"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Portfolio
        </a>
      </div>

      @if (portfolioService.portfolios$ | async; as portfolios) {
        @if (portfolios.length === 0) {
          <div class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400 mb-4">No portfolios yet.</p>
            <a
              routerLink="/portfolios/new"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create your first portfolio
            </a>
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (portfolio of portfolios; track portfolio.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                  <a
                    [routerLink]="['/portfolios', portfolio.id]"
                    class="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {{ portfolio.name }}
                  </a>
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ stockCount(portfolio) }} stock{{ stockCount(portfolio) !== 1 ? 's' : '' }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Updated {{ portfolio.updatedAt | date: 'MMM d, y' }}
                </p>

                <div class="flex items-center gap-2">
                  <a
                    [routerLink]="['/portfolios', portfolio.id, 'edit']"
                    class="flex-1 text-center py-1.5 text-sm border border-gray-300 dark:border-gray-600
                           rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </a>
                  <button
                    (click)="confirmDelete(portfolio)"
                    class="flex-1 py-1.5 text-sm border border-red-300 text-red-600
                           rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <div class="flex justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    </div>
  `,
})
export class PortfolioListComponent {
  protected readonly portfolioService = inject(PortfolioService);
  private readonly toast = inject(ToastService);

  protected stockCount(portfolio: PortfolioResponse): number {
    return Object.keys(portfolio.stocks).length;
  }

  protected confirmDelete(portfolio: PortfolioResponse): void {
    if (!confirm(`Delete "${portfolio.name}"? This cannot be undone.`)) return;
    this.portfolioService.delete(portfolio.id).subscribe({
      next: () => {
        this.toast.success(`"${portfolio.name}" deleted.`);
        this.portfolioService.refresh();
      },
    });
  }
}
