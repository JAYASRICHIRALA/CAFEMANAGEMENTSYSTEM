/*import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api';
  constructor(private router: Router) {}

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }
    else{
    return true;
    }
  }
  
  
}*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api'; // Set your backend base URL here

  constructor(private router: Router, private http: HttpClient) {}

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']); // Redirect to login or home page if not authenticated
      return false;
    } else {
      return true;
    }
  }

  // Method to change the password
  public changePassword(requestMap: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/changePassword`, requestMap);
  }
}

