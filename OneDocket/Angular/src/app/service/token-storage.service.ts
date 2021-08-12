import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const APPOINTMENT_KEY = 'auth-appointmentList';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public saveAppointmentList(appointmentList: any): void {
    window.sessionStorage.removeItem(APPOINTMENT_KEY);
    window.sessionStorage.setItem(APPOINTMENT_KEY, JSON.stringify(appointmentList));
  }

  public getAppointmentList(): any {
    const appointmentList = window.sessionStorage.getItem(APPOINTMENT_KEY);
    if (appointmentList) {
      return JSON.parse(appointmentList);
    }

    return {};
  }


}
