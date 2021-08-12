import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TokenStorageService } from '../service/token-storage.service';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
    currentURL = this.router.url;
    user = this.currentURL.substr(17);
    eventList: any[] = [];


    //Time Variables
    startTime = "12:00pm";
    date = {year: 2021, month: 7, day: 30};
    times = [
      {hour: 8, minute: 0},
      {hour: 8, minute: 30},
      {hour: 9, minute: 0},
      {hour: 9, minute: 30},
      {hour: 10, minute: 0},
      {hour: 10, minute: 30},
      {hour: 11, minute: 0},
      {hour: 11, minute: 30},
      {hour: 12, minute: 0},
      {hour: 12, minute: 30},
      {hour: 13, minute: 0},
      {hour: 13, minute: 30},
      {hour: 14, minute: 0},
      {hour: 14, minute: 30},
      {hour: 15, minute: 0},
      {hour: 15, minute: 30},
      {hour: 16, minute: 0},
      {hour: 16, minute: 30},
      {hour: 17, minute: 0},
      {hour: 17, minute: 30},
      {hour: 18, minute: 0},
      {hour: 18, minute: 30},
      {hour: 19, minute: 0},
      {hour: 19, minute: 30},
      {hour: 20, minute: 0},
    ];

    availableTimes:any[] = [];
    availableTimeStrings:any[] = [];

    //time  = "12:00pm";


    //For Adding Appointments
    title = '';
    description = '';
    mail = '';
    number = '';
    isMoved = false;
    errorMessage = '';

    //meridian = true;
    closeResult = '';


    @ViewChild('invalid') invalid: any;
    @ViewChild('added') added: any;



    constructor(private tokenStorageService: TokenStorageService, private modalService: NgbModal, private calendar: NgbCalendar, private config: NgbDatepickerConfig, private authService: AuthService, private appointmentService: AppService, private router: Router) {
      const current = new Date();
      config.minDate = { year: current.getFullYear(), month:
      current.getMonth() + 1, day: current.getDate() };
      config.maxDate = { year: 2099, month: 12, day: 31 };
      config.outsideDays = 'hidden';
      this.date = config.minDate;
    }


    //Time Conversion function
    //=======================================
    convertDate(date: {year: number, month: number, day: number}, time: {hour: number, minute: number}) :string {
      //2021-07-18T11:30:00 (example date format)
      var year = date.year.toString();

      if(date.month < 10){
        var month = '0' + date.month.toString();
      }
      else{
        var month = date.month.toString();
      }

      if(date.day < 10){
        var day = '0' + date.day.toString();
      }
      else{
         var day = date.day.toString();
      }

      if(time.hour < 10){
        var hour = '0' + time.hour.toString();
      }
      else{
         var hour = time.hour.toString();
      }

      if(time.minute < 10){
        var minute = '0' + time.minute.toString();
      }
      else{
         var minute = time.minute.toString();
      }

      return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00';
    }

    extractDate(datetime: string): {year: number, month: number, day: number}{
      //2021-07-18T11:30:00 (example date format)
      var y = datetime.substr(0, 4);
      var yr = Number(y);
      var m = datetime.substr(5, 2);
      var mth = Number(m);
      var d = datetime.substr(8, 2);
      var dy = Number(d);
      return {year: yr, month: mth, day: dy};
    }

    extractTime(datetime: string): {hour: number, minute: number} {
      var h = datetime.substr(11, 2);
      var hr = Number(h);
      var m = datetime.substr(14, 2);
      var min = Number(m);
      return {hour: hr, minute: min};
    }

    extractTimeTheSequel(time: string): {hour: number, minute: number}{
      var hour  = time.substr(0, 2);
      if (hour === "12" || hour === "11" || hour === "10"){
        var hr = Number(hour);
        var minute = time.substr(3, 2);
        var min = Number(minute);
      }
      else{
        hour = time.substr(0, 1);
        hr = Number(hour);
        var minute = time.substr(2, 2);
        var min = Number(minute);
      }
      return {hour: hr, minute: min};
    }

    addTime(time: {hour: number, minute: number}):{hour: number, minute: number}{
      var min = time.minute;
      var hr = time.hour;
      if (min === 0){
        min += 30;
      }
      else if (min === 30){
        min = 0;
        hr += 1;
      }
      return {hour: hr, minute: min};
    }
    //=====================================



    //Equals Methods
    //=====================================
    datesMatch(date1: {year: number, month: number, day: number}, date2: {year: number, month: number, day: number}): boolean{
        if (date1.year !== date2.year){
          return false;
        }
        else if (date1.month !== date2.month){
          return false;
        }
        else if (date1.day !== date2.day){
          return false;
        }
        else{
          return true;
        }
    }

    timesMatch(time1: {hour: number, minute: number}, time2: {hour: number, minute: number}): boolean{
      if (time1.hour !== time2.hour){
        return false;
      }
      else if (time1.minute !== time2.minute){
        return false;
      }
      else{
        return true;
      }
    }
    //=====================================




    //Checking Available Times
    //====================================
    matchingDates(date: {year: number, month: number, day: number}){
      var timeList:{hour: number, minute: number}[] = [];
      for(let i = 0; i < this.eventList.length; i++){
        if (this.datesMatch(this.eventList[i].date, date)){
          timeList.push(this.eventList[i].time);
        }
      }
      return timeList;
    }

    checkAvailableTimes(date: {year: number, month: number, day: number}){
      this.availableTimes = [];
      var timesList = this.matchingDates(date);
      for (let i=0; i <  this.times.length; i++){
        var taken = false;
        for (let j=0; j < timesList.length; j++){
          if (this.timesMatch(this.times[i], timesList[j])){
            taken = true;
          }
        }
        if (!taken){
          this.availableTimes.push(this.times[i]);
        }
      }
      this.presentList();
    }

    presentList(){
      this.availableTimeStrings = [];
      for (let i =0; i < this.availableTimes.length; i++){
        var minute = this.availableTimes[i].minute;
        var hour = this.availableTimes[i].hour;
        var meridian = "am";
        var min: string;
        var hr: string;
        if(minute < 10){
          min = '0' + minute.toString();
        }
        else{
           min = minute.toString();
        }
        if(hour > 12){
          hour = hour - 12;
          meridian = "pm";
          hr = hour.toString();
        }
        else if(hour === 12){
          meridian = "pm";
          hr = hour.toString();
        }
        else{
           hr = hour.toString();
        }
        var time  = hr + ":" + min + meridian;

        this.availableTimeStrings.push(time);
      }
    }
    //=======================================



    //Save Appointments
    //=======================================
    setTime(t: string){
      this.startTime = t;
    }

    onSave() {
      if (this.user === ""){
        this.viewInvalid(this.invalid);
      }
      else{
        var startTime = this.extractTimeTheSequel(this.startTime);
        var endTime = this.addTime(startTime);
        var start = this.convertDate(this.date, startTime);
        var end = this.convertDate(this.date, endTime);


        this.appointmentService.addAppointment(this.user, this.title, start, end, this.mail, this.number, this.description,).subscribe(
          data => {
            console.log(data);
          },
          err => {
            this.errorMessage = err.error.message;
          }
        );
        this.viewAdded(this.added);
      }
    }

    //=======================================




    //For Updating Dashboard
    //========================================
    createEventList() {
      if (this.user === ""){
      }
      else{
        this.eventList = [];
        this.appointmentService.getAppointmentList(this.user).subscribe(
          data => {
            this.tokenStorageService.saveAppointmentList(data);
          },
          err => {
            this.errorMessage = err.error.message;
          }
        );

        var appointmentList = this.tokenStorageService.getAppointmentList();


        for (let i = 0; i < appointmentList.appointments.length; i++) {
          var eventDate = this.extractDate(appointmentList.appointments[i].start);
          var eventTime = this.extractTime(appointmentList.appointments[i].start);
          this.eventList.push({
            date: eventDate,
            time: eventTime
            }
          );
        }

    }
  }

    //=======================================


    viewInvalid(view: any) {
       this.modalService.open(view, {ariaLabelledBy: 'invalid-url'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
       }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       });
    }

    viewAdded(view: any) {
       this.modalService.open(view, {ariaLabelledBy: 'appointment-added'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
       }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       });
    }


     private getDismissReason(reason: any): string {
       if (reason === ModalDismissReasons.ESC) {
         return 'by pressing ESC';
       } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
         return 'by clicking on a backdrop';
       } else {
         return `with: ${reason}`;
       }
     }




    ngOnInit() {
      this.createEventList();
      this.checkAvailableTimes(this.date);
    }

}
