import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};