import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { PortfolioResponse } from '../../../shared/models/portfolio.model';

@Component({
  selector: 'app-portfolio-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl space-y-6">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <a routerLink="/portfolios" class="hover:text-blue-600 transition-colors">Portfolios</a>
        <span>/</span>
        <span class="text-gray-900 dark:text-gray-100">{{ isEditMode() ? 'Edit' : 'New Portfolio' }}</span>
      </div>

      <h1 class="text-2xl font-bold">{{ isEditMode() ? 'Edit Portfolio' : 'New Portfolio' }}</h1>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Portfolio Name
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="e.g. Growth Portfolio"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              [class.border-red-500]="isInvalid('name')"
            />
            @if (isInvalid('name')) {
              <p class="text-red-500 text-xs mt-1">Portfolio name is required.</p>
            }
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Holdings
              </label>
              <button
                type="button"
                (click)="addStock()"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add stock
              </button>
            </div>

            <div formArrayName="stocks" class="space-y-2">
              @for (stock of stocks.controls; track $index; let i = $index) {
                <div [formGroupName]="i" class="flex items-center gap-2">
                  <input
                    formControlName="ticker"
                    placeholder="TICKER"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono uppercase
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                  <input
                    formControlName="shares"
                    type="number"
                    placeholder="Shares"
                    step="any"
                    min="0"
                    class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                  <button
                    type="button"
                    (click)="removeStock(i)"
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove stock"
                  >
                    ✕
                  </button>
                </div>
              }
              @if (stocks.length === 0) {
                <p class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                  No stocks added yet.
                </p>
              }
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              [disabled]="saving()"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-medium rounded-lg transition-colors"
            >
              {{ saving() ? 'Saving…' : (isEditMode() ? 'Save changes' : 'Create portfolio') }}
            </button>
            <a
              routerLink="/portfolios"
              class="px-5 py-2 border border-gray-300 dark:border-gray-600
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class PortfolioFormComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  @Input() id?: string;

  protected readonly saving = signal(false);
  protected readonly isEditMode = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    stocks: this.fb.array<ReturnType<typeof this.createStockGroup>>([]),
  });

  get stocks(): FormArray {
    return this.form.get('stocks') as FormArray;
  }

  ngOnInit(): void {
    if (this.id) {
      this.isEditMode.set(true);
      this.portfolioService.getById(Number(this.id)).subscribe((p) => this.populateForm(p));
    }
  }

  protected addStock(ticker = '', shares: number | null = null): void {
    this.stocks.push(this.createStockGroup(ticker, shares));
  }

  protected removeStock(index: number): void {
    this.stocks.removeAt(index);
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { name } = this.form.getRawValue();
    const stocks = this.stocksToRecord();

    this.saving.set(true);

    const request$ = this.isEditMode()
      ? this.portfolioService.update(Number(this.id), { name, stocks })
      : this.portfolioService.create({ name, stocks });

    request$.pipe(finalize(() => this.saving.set(false))).subscribe((p) => {
      this.toast.success(
        this.isEditMode() ? 'Portfolio updated.' : 'Portfolio created.',
      );
      this.router.navigate(['/portfolios', p.id]);
    });
  }

  protected isInvalid(field: 'name'): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  private createStockGroup(ticker = '', shares: number | null = null) {
    return this.fb.nonNullable.group({
      ticker: [ticker, Validators.required],
      shares: [shares, [Validators.required, Validators.min(0)]],
    });
  }

  private populateForm(p: PortfolioResponse): void {
    this.form.patchValue({ name: p.name });
    this.stocks.clear();
    Object.entries(p.stocks).forEach(([ticker, shares]) => this.addStock(ticker, shares));
  }

  private stocksToRecord(): Record<string, number> {
    return this.stocks.controls.reduce(
      (acc, ctrl) => {
        const { ticker, shares } = ctrl.getRawValue() as { ticker: string; shares: number };
        if (ticker) acc[ticker.toUpperCase()] = shares;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
