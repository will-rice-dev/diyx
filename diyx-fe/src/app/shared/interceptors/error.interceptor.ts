import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../components/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.logout();
        toast.error('Session expired. Please log in again.');
      } else {
        const message = err.error?.message ?? err.message ?? 'An unexpected error occurred.';
        toast.error(message);
      }
      return throwError(() => err);
    }),
  );
};
