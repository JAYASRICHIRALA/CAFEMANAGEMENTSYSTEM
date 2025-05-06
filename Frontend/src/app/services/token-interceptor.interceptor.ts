// File: src/app/interceptors/token-interceptor.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("token"); // Fetch token from localStorage

    if (token) {
      console.log('Token being sent:', token); // Debugging
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
      });
      console.log('Token being sent:',token);
    } else {
      console.warn('No token found in localStorage'); // Debugging
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
         /* console.error(
            `Error occurred: ${err.message}, Status: ${err.status}, URL: ${err.url}`
          );*/
          console.error('Unauthorized or Forbidden:', err.message);

          // If unauthorized, clear local storage and navigate to login
          localStorage.clear();
          this.router.navigate(['/']);
        }

        return throwError(() => new Error(err.message || 'Server error'));
      })
    );
  }
}
