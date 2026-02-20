import { Routes } from '@angular/router';

export const portfoliosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portfolio-list/portfolio-list').then((m) => m.PortfolioListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./portfolio-form/portfolio-form').then((m) => m.PortfolioFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./portfolio-detail/portfolio-detail').then((m) => m.PortfolioDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./portfolio-form/portfolio-form').then((m) => m.PortfolioFormComponent),
  },
];
