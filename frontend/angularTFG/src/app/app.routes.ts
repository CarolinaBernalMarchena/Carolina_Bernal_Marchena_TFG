import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';
import { Collection } from './pages/collection/collection';
import { Achievements } from './pages/achievements/achievements';
import { Shop } from './pages/shop/shop';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'register', component: Register },
    { path: 'profile', component: Profile },
    { path: 'settings', component: Settings },
    { path: 'collection', component: Collection },
    { path: 'collection/:id', loadComponent: () => import('./pages/collection-detail/collection-detail').then(m => m.CollectionDetail) },
    { path: 'achievements', component: Achievements },
    { path: 'shop', component: Shop },
];