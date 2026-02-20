import { Component, inject } from '@angular/core';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium
                 transition-all duration-300 min-w-64 max-w-sm"
          [class]="toastClass(toast)"
          role="alert"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected toastClass(toast: Toast): string {
    const base = 'flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium';
    switch (toast.type) {
      case 'success':
        return `${base} bg-green-600 text-white`;
      case 'error':
        return `${base} bg-red-600 text-white`;
      default:
        return `${base} bg-gray-800 text-white`;
    }
  }
}
