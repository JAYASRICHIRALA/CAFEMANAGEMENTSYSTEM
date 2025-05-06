import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl; // Use private to restrict direct access

  constructor(private httpClient: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/user/signup`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) // Cleaner header definition
    });
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/user/forgotPassword`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/user/login`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  checkToken(): Observable<any> {
    return this.httpClient.get(`${this.url}/user/checkToken`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  changePassword(data: any, p0: { responseType: string; }): Observable<any> {
    return this.httpClient.post(`${this.url}/user/changePassword`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' // Ensure the backend returns a plain string
    });
  }

  getUsers(): Observable<any> {
    return this.httpClient.get(`${this.url}/user/get`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/user/update`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
