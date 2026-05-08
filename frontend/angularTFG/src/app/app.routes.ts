import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';
import { Collection } from './pages/collection/collection';
import { CollectionDetail } from './pages/collection-detail/collection-detail';
import { Achievements } from './pages/achievements/achievements';
import { Shop } from './pages/shop/shop';
import { Trades } from './pages/trades/trades';
import { CreateTrade } from './pages/create-trade/create-trade';
import { UserStatistics } from './pages/user-statistics/user-statistics';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //Usuarios no logueados
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  //Usuarios logueados
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'collection', component: Collection, canActivate: [authGuard] },
  {
    path: 'collection-detail/:type',
    component: CollectionDetail,
    canActivate: [authGuard],
  },
  { path: 'achievements', component: Achievements, canActivate: [authGuard] },
  { path: 'shop', component: Shop, canActivate: [authGuard] },
  { path: 'trades', component: Trades, canActivate: [authGuard] },
  { path: 'create-trade', component: CreateTrade, canActivate: [authGuard] },
  { path: 'statistics', component: UserStatistics, canActivate: [authGuard] },
];
