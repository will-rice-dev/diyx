import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, shareReplay } from 'rxjs';
import {
  CreatePortfolioRequest,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '../../../shared/models/portfolio.model';
import { retryWithBackoff } from '../../../shared/utils/rx-operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/portfolios`;

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly portfolios$: Observable<PortfolioResponse[]> = this.refresh$.pipe(
    switchMap(() =>
      this.http.get<PortfolioResponse[]>(this.baseUrl).pipe(retryWithBackoff(3, 500)),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  refresh(): void {
    this.refresh$.next();
  }

  getById(id: number): Observable<PortfolioResponse> {
    return this.http
      .get<PortfolioResponse>(`${this.baseUrl}/${id}`)
      .pipe(retryWithBackoff(2, 500));
  }

  create(body: CreatePortfolioRequest): Observable<PortfolioResponse> {
    return this.http.post<PortfolioResponse>(this.baseUrl, body);
  }

  update(id: number, body: UpdatePortfolioRequest): Observable<PortfolioResponse> {
    return this.http.patch<PortfolioResponse>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
