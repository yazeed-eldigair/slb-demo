import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard'
  },
  {
    path: 'wells',
    loadComponent: () => import('./components/wells/wells.component').then(m => m.WellsComponent),
    title: 'Wells'
  },
  {
    path: 'production',
    loadComponent: () => import('./components/production/production.component').then(m => m.ProductionComponent),
    title: 'Production Data'
  },
  {
    path: 'map',
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
    title: 'Well Map'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
