import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TokenStorageService } from '../service/token-storage.service';
import { FullCalendarComponent, CalendarOptions} from '@fullcalendar/angular';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { AppService } from '../service/app.service';


@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})


export class BoardUserComponent implements OnInit {

    user = this.tokenStorageService.getUser();
    eventList: any[] = [];

    //For Adding Appointments
    startTime = {hour: 12, minute: 0};
    endTime = {hour: 13, minute: 0};

    title = '';
    description = '';
    mail = '';
    number = '';
    isMoved = false;
    errorMessage = '';

    meridian = true;
    closeResult = '';
    date = {year: 2021, month: 7, day: 30};



    //View Appointment data
    name = 'N/A';
    begins = 'no events available';
    ends = 'no events available';
    details = 'No Description';
    email = 'n/a';
    phoneNumber = 'n/a';
    id = '';
    @ViewChild('view') view: any;
    @ViewChild('content') content: any;
    @ViewChild('added') added: any;
    @ViewChild('invalid') invalid: any;

    constructor(private tokenStorageService: TokenStorageService, private modalService: NgbModal, private calendar: NgbCalendar, private config: NgbDatepickerConfig, private authService: AuthService, private appointmentService: AppService) {
        const current = new Date();
        config.minDate = { year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate() };
        config.maxDate = { year: 2099, month: 12, day: 31 };
        config.outsideDays = 'hidden';
        this.date = config.minDate;
      }

    /*
    Dashboard Calendar and Settings
    */
    calendarOptions: CalendarOptions = {
      headerToolbar: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'prev,next',
      },

      initialView: 'dayGridMonth',

      eventClick: this.handleEventClick.bind(this), // bind is important!
      events: []
    };

    handleEventClick(arg: any) {
      this.name = arg.event.title;
      this.begins = arg.event.start;
      this.ends = arg.event.end;
      this.email = arg.event.extendedProps.email;
      this.phoneNumber = arg.event.extendedProps.phoneNumber;
      this.id = arg.event.extendedProps.id;
      this.details = arg.event.extendedProps.details;

      this.viewAppointment(this.view);
    }

/*
    //Figure Out Later
    //=============================================

  getDay(day: string) :string{
    var str = day.substr(0,3);
    return str;
  }

  getEventTime(time: string) :string{
    return time.substr(14,19);
  }

  getAppointmentTime(time: string) :string{
    return time.substr(11,15);
  }
*/

    /*
    End of Dashboard Calendar Funcntions
    */



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

    

    //=======================================



    //Save Appointments
    //=======================================
    onSave() {
      var start = this.convertDate(this.date, this.startTime);
      var end = this.convertDate(this.date, this.endTime);

      if (!this.isDuplicateTime(start)){
        this.appointmentService.addAppointment(this.user.username, this.title, start, end, this.mail, this.number, this.description,).subscribe(
          data => {
            console.log(data);
          },
          err => {
            this.errorMessage = err.error.message;
          }
        );

        this.viewAdded(this.added);

        if (this.isMoved){
          this.removeAppointment();
        }

        this.resetData();
      }else{
        this.viewInvalid(this.invalid);
      }
    }

    resetData(){
      this.title = '';
      this.description = '';
      this.mail = '';
      this.number = '';
      this.isMoved = false;
    }

    isDuplicateTime(start: string): boolean{
        var isDuplicate = false;
        for (let i = 0; i < this.eventList.length; i++){
          if(this.eventList[i].start === start){
            isDuplicate = true;
          }
        }
        return isDuplicate;
    }

    //=======================================


    //Removing Appointments
    //=======================================
    removeAppointment(){
      var appointmentList = this.tokenStorageService.getAppointmentList();

      for (let i = 0; i < appointmentList.appointments.length; i++) {
          var appointment = appointmentList.appointments[i];
           if (appointment._id === this.id){
             this.appointmentService.removeAppointment(this.user.username, appointment._id).subscribe(
               data => {
                 console.log(data);
               },
               err => {
                 this.errorMessage = err.error.message;
               }
             );
           }
      }

    }
    //=======================================


    //Move Appointments
    //======================================
    moveAppointment(){
      this.title = this.name;
      this.description = this.details;
      this.mail = this.email;
      this.number = this.phoneNumber;
      this.isMoved = true;
      this.open(this.content);
    }

    //======================================


    //For Updating Dashboard
    //========================================
    createEventList() {
      this.eventList = [];
      this.appointmentService.getAppointmentList(this.user.username).subscribe(
        data => {
          this.tokenStorageService.saveAppointmentList(data);
        },
        err => {
          this.errorMessage = err.error.message;
        }
      );

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
      this.calendarOptions.events = this.eventList;

    }
    //=======================================



    //Add Appointment Display Functions
    //=======================================
    open(content: any) {

       this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
       }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       });
    }

    viewAppointment(view: any) {
       this.modalService.open(view, {ariaLabelledBy: 'view-appointment'}).result.then((result) => {
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

    viewInvalid(view: any) {
       this.modalService.open(view, {ariaLabelledBy: 'invalid-url'}).result.then((result) => {
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
    //======================================


    ngOnInit() {
      this.createEventList();
    }

}
