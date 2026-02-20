import { Observable, retry, timer } from 'rxjs';

/**
 * Retries an observable with exponential backoff.
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelayMs - Initial delay in milliseconds (default: 1000)
 */
export function retryWithBackoff<T>(
  maxRetries = 3,
  initialDelayMs = 1000,
): (source: Observable<T>) => Observable<T> {
  return (source) =>
    source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          const delay = initialDelayMs * Math.pow(2, retryCount - 1);
          console.warn(`Retry attempt ${retryCount} after ${delay}ms`, error);
          return timer(delay);
        },
      }),
    );
}
