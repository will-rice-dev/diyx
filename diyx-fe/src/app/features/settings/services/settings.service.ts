import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { SettingsResponse, UpdateSettingsRequest } from '../../../shared/models/settings.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/users/me/settings`;

  readonly settings$: Observable<SettingsResponse> = this.http
    .get<SettingsResponse>(this.url)
    .pipe(shareReplay(1));

  update(body: UpdateSettingsRequest): Observable<SettingsResponse> {
    return this.http.patch<SettingsResponse>(this.url, body);
  }
}
