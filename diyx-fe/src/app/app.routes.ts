import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/shell-layout/shell-layout').then((m) => m.ShellLayoutComponent),
    children: [
      {
        path: 'portfolios',
        loadChildren: () =>
          import('./features/portfolios/portfolios.routes').then((m) => m.portfoliosRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
      { path: '', redirectTo: 'portfolios', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'portfolios' },
];
