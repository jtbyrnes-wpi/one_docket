import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../service/token-storage.service';
import { AuthService } from '../service/auth.service';
import { AppService } from '../service/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser = this.tokenStorageService.getUser();
  eventList: any[] = [];
  appointmentCount = this.eventList.length;

  constructor(private tokenStorageService: TokenStorageService, private appointmentService: AppService, private authService: AuthService) { }

  createEventList(){
    this.eventList = [];
    var appointmentList = this.tokenStorageService.getAppointmentList();

    for (let i = 0; i < appointmentList.appointments.length; i++) {
      this.eventList.push({
        title: appointmentList.appointments[i].title,
        start: appointmentList.appointments[i].start,
        end: appointmentList.appointments[i].end,
        extendedProps: {
          id: appointmentList.appointments[i]._id,
          email: appointmentList.appointments[i].email,
          phoneNumber: appointmentList.appointments[i].phoneNumber,
          details: appointmentList.appointments[i].details,
        }
      });
    }
    this.appointmentCount = this.eventList.length;
  }

  deleteAccount(){

  }


  ngOnInit(): void {
    this.createEventList();
  }
}
