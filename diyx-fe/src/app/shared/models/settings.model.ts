export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface SettingsResponse {
  timezone: string;
  theme: Theme;
}

export interface UpdateSettingsRequest {
  timezone?: string;
  theme?: Theme;
}
