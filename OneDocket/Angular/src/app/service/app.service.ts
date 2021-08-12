import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/app/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }

  getAppointmentList(username: string): Observable<any> {
    return this.http.post(AUTH_API + 'getAppointmentList', {
      username
    }, httpOptions);
  }

  addAppointment(username: string, title: string, start: string, end: string, email: string, phoneNumber: string, details: string): Observable<any> {
    return this.http.post(AUTH_API + 'addAppointment', {
      username,
      title,
      start,
      end,
      email,
      phoneNumber,
      details
    }, httpOptions);
  }

  removeAppointment(username: string, id: string): Observable<any> {
    return this.http.post(AUTH_API + 'removeAppointment', {
      username,
      id
    }, httpOptions);
  }
}
