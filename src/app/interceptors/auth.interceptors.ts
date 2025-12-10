import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the auth token from the service
  const token = authService.getToken();

  // Clone the request and add the authorization header
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expired or invalid
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      }
      
      // Re-throw the error for the component to handle
      return throwError(() => error);
    })
  );
};